import cv2
import layoutparser as lp
import concurrent.futures
from concurrent.futures import ThreadPoolExecutor
import time
import os
from pdf2image import convert_from_path
import numpy as np
import pdfkit
from pdf2docx import Converter
from shapely import box 
import base64
import fitz 
from natsort import natsorted
import PyPDF2
from PyPDF2 import PdfReader, PdfWriter
import sys

def start_model():
    global model, ocr_agent
    model = lp.Detectron2LayoutModel(
    "/home/manik/.torch/iopath_cache/s/f3b12qc4hc0yh4m/config.yml",
    "/home/manik/.torch/iopath_cache/s/dgy9c10wykk4lq4/model_final.pth",
    extra_config=["MODEL.ROI_HEADS.SCORE_THRESH_TEST", 0.18],
    label_map={0: "Text", 1: "Title", 2: "List", 3: "Table", 4: "Figure"},
    )
    ocr_agent = lp.TesseractAgent(languages='eng')
def process_image(image,model,n,pdf_no):
    layout = model.detect(image) 
    layout_without_Fig = lp.Layout([b for b in layout if b.type=="Title" or b.type=="List" or b.type=="Table" or b.type=="Text"])

    class Rectangle:
        def __init__(self, x_1, y_1, x_2, y_2):
            self.x_1 = x_1
            self.y_1 = y_1
            self.x_2 = x_2
            self.y_2 = y_2

    def calculate_intersection_area(box1, box2):
        x_overlap = max(0, min(box1.x_2, box2.x_2) - max(box1.x_1, box2.x_1))
        y_overlap = max(0, min(box1.y_2, box2.y_2) - max(box1.y_1, box2.y_1))
        return x_overlap * y_overlap

    def is_more_than_50_percent_intersecting(box1, box2):
        intersection_area = calculate_intersection_area(box1, box2)
        area_box1 = (box1.x_2 - box1.x_1) * (box1.y_2 - box1.y_1)
        return intersection_area / area_box1 > 0.5

    def eliminate_intersecting_boxes(boxes):
        result_boxes = []
        for i, box1 in enumerate(boxes):
            is_intersecting_other = False
            for j, box2 in enumerate(boxes[i+1:]):
                j += i + 1
                if is_more_than_50_percent_intersecting(box1.block, box2.block):
                    is_intersecting_other = True
                    break
            if not is_intersecting_other:
                result_boxes.append(box1)
        return result_boxes

    filtered_elements = eliminate_intersecting_boxes(layout_without_Fig)
    figure_blocks = [box for box in layout if box.type == 'Figure' and box.score>0.6]
    for box1 in (figure_blocks):
        temp1=box(box1.block.x_1,box1.block.y_1,box1.block.x_2,box1.block.y_2)
        for box2 in(filtered_elements):
            temp2=box(box2.block.x_1,box2.block.y_1,box2.block.x_2,box2.block.y_2)
            intersection_area = temp2.intersection(temp1).area
            total_area = temp2.area 
            percentage_intersecting = (intersection_area / total_area) * 100
            if percentage_intersecting > 40:
                box1.block.x_2=(box2.block.x_1)-2
    figure_blocks=sorted(figure_blocks,key=lambda x: x.block.y_1)


    output_folder=f"/home/manik/Desktop/Dell/{pdf_no}/page_image"
    for i, block in enumerate(figure_blocks, start=1):
        segment_image = (block
                        .pad(left=5, right=5, top=5, bottom=5)
                        .crop_image(image))
        image_filename = os.path.join(output_folder, f'Page{n}_segment_image_{i}.png')
        try:
            cv2.imwrite(image_filename, segment_image)
        except cv2.error as e:
            print(f"Error while saving image:", n)
    text_blocks = lp.Layout([b for b in filtered_elements])
    h, w = image.shape[:2]

    left_interval = lp.Interval(0, w/2*1.05, axis='x').put_on_canvas(image)

    left_blocks = text_blocks.filter_by(left_interval, center=True)
    left_blocks.sort(key=lambda b: b.coordinates[1])

    right_blocks = [b for b in text_blocks if b not in left_blocks]
    right_blocks.sort(key=lambda b: b.coordinates[1])

    text_blocks = lp.Layout([b.set(id=idx) for idx, b in enumerate(left_blocks + right_blocks)])

    def process_text_block(block):
        segment_image = (block.pad(left=5, right=5, top=5, bottom=5)
                         .crop_image(image))
        text = ocr_agent.detect(segment_image)
        block.set(text=text, inplace=True)
    
    num_workers = 2
    with ThreadPoolExecutor(max_workers=num_workers) as executor:
        executor.map(process_text_block, text_blocks)

    result_blocks=text_blocks.copy()
    def remove_whitespace(s):
        return ''.join(s.split())

    for i in range(len(text_blocks)):
        for j in range(i+1, len(text_blocks)):
            st1 = text_blocks[i].text
            st2 = text_blocks[j].text
            if remove_whitespace(st1) in remove_whitespace(st2):
                del result_blocks[i]
            elif remove_whitespace(st2) in remove_whitespace(st1):
                del result_blocks[j]


    return result_blocks,figure_blocks

def generate_css_and_html(result_blocks,figure_blocks,n,pdf_no):
    css_code = ""
    for i, box in enumerate(result_blocks, start=1):
        left = box.block.x_1
        top = box.block.y_1
        width = box.block.x_2 - box.block.x_1
        css_code += f'''.text-block{i} {{
            left: {left}px;
            top: {top}px;
            width: {width}px;
        }}
        '''
    for i, box in enumerate(figure_blocks, start=1):
        left = box.block.x_1
        top = box.block.y_1
        width = box.block.x_2 - box.block.x_1
        css_code += f'''.image-block{i} {{
            left: {left}px;
            top: {top}px;
            width: {width}px;
        }}
            .image-block{i} img {{
            width: 100%;
            height: auto;
        }} 
        '''

    html_code = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Generated Blocks</title>
        <style>
            body {{
                margin: 0;
                padding: 0;
            }}

            .bounding-box {{
                position: relative;
                width: 1240px;
                height: 1753px;
                margin: 0 auto;
            }}

            .text-block {{
                position: absolute;
                font-size: 18px;
            }}

            {css_code}
        </style>
    </head>
    <body>
        <div class="bounding-box">
    """

    for i, box in enumerate(result_blocks, start=1):
        html_code += f'''\n            <div class="text-block text-block{i}">\n                {box.text}\n            </div>'''

    for i, block in enumerate(figure_blocks, start=1):
        img_tag = f'<img src="/home/manik/Desktop/Dell/{pdf_no}/page_image/Page{n}_segment_image_{i}.png" />' 
        html_code += f'''\n        <div class="text-block image-block{i}">\n{img_tag}\n</div>\n'''
    html_code += """
        </div>
    </body>
    </html>
    """

    return html_code
def delete_alternate_pages(input_pdf, output_pdf):
    with open(input_pdf, 'rb') as input_file, open(output_pdf, 'wb') as output_file:
        reader = PdfReader(input_file)
        writer = PdfWriter()

        keep_pages = [page_num for page_num in range(len(reader.pages)) if page_num % 2 == 0]

        for page_num in keep_pages:
            page = reader.pages[page_num]
            if "/Annots" in page:
                annots = page["/Annots"].get_object()
                for annot in annots:
                    writer.add_annotation(annot)
            writer.add_page(page)

        writer.write(output_file)


def convert_html_to_pdf_and_docx(html_file_path, pdf_file, word_file,pdf_no):
    cwd = f'/home/manik/Desktop/Dell/{pdf_no}/Html Folder'
    onlyfiles = [os.path.join(cwd, f) for f in os.listdir(cwd) if 
    os.path.isfile(os.path.join(cwd, f))]
    print(onlyfiles)
    sorted_files = sorted(onlyfiles)    
    kitoptions = {
        "enable-local-file-access": None
    }
    pdfkit.from_file(sorted_files, f'/home/manik/Desktop/Dell/{pdf_no}/PDF Folder/final_temp.pdf', options=kitoptions)
    delete_alternate_pages(f'/home/manik/Desktop/Dell/{pdf_no}/PDF Folder/final_temp.pdf',pdf_file)
    cv = Converter(pdf_file)
    cv.convert(word_file, start=0, end=None)
    cv.close()

def extract_images_from_pdf(pdf_path, output_folder,pdf_no):
    pdf_document = fitz.open(pdf_path)

    for page_number in range(pdf_document.page_count):
        page = pdf_document[page_number]
        images = page.get_images(full=True)

        for img_index, img_info in enumerate(images):
            img_index = img_info[0]
            base_image = pdf_document.extract_image(img_index)
            image_bytes = base_image["image"]
            image_filename = f"/home/manik/Desktop/Dell/{pdf_no}/pdf_im/page_{page_number + 1}.png"
            with open(image_filename, "wb") as image_file:
                image_file.write(image_bytes)


    pdf_document.close()

pdf_path=sys.argv[1]
def completed_call(pdf_path,pdf_no):
    print(sys.argv[1],sys.argv[2])
    start_model()
    os.makedirs(f'/home/manik/Desktop/Dell/{pdf_no}')
    os.makedirs(f'/home/manik/Desktop/Dell/{pdf_no}/Html Folder')
    os.makedirs(f"/home/manik/Desktop/Dell/{pdf_no}/PDF Folder")
    os.makedirs(f'/home/manik/Desktop/Dell/{pdf_no}/word_output')
    os.makedirs(f'/home/manik/Desktop/Dell/{pdf_no}/pdf_im')
    os.makedirs(f"/home/manik/Desktop/Dell/{pdf_no}/page_image")


    folder_path = f'/home/manik/Desktop/Dell/{pdf_no}/Html Folder'  
    pdf_file = f"/home/manik/Desktop/Dell/{pdf_no}/PDF Folder/final.pdf"
    word_file = sys.argv[2]
    
    extract_images_from_pdf(pdf_path,f'/home/manik/Desktop/Dell/{pdf_no}/pdf_im',pdf_no)
    all_files = os.listdir(f'/home/manik/Desktop/Dell/{pdf_no}/pdf_im')
    image_path= natsorted([os.path.join(f'/home/manik/Desktop/Dell/{pdf_no}/pdf_im', file) for file in all_files if file.lower().endswith('.png')])

    print(image_path)  
    '''Image to word'''
    for i in range(len(image_path)):
        image=cv2.imread(image_path[i])
        image = image[..., ::-1]
        result,fig_block = process_image(image, model,i,pdf_no)
        html_code=generate_css_and_html(result,fig_block,i,pdf_no)
        file_name = f'page{i}.html'
        file_path = f"{folder_path}/{file_name}"
        with open(file_path, 'w') as html_file:
            html_file.write(html_code)
    convert_html_to_pdf_and_docx(folder_path, pdf_file, word_file,pdf_no)

start_time = time.time()

ls=pdf_path.split('/')
name="Temp"+ls[-1]
completed_call(pdf_path,name)
elapsed_time = time.time() - start_time
print(f"Elapsed Time: {elapsed_time} seconds")

