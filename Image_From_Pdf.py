from pdf2image import convert_from_path
from PIL import Image
import cv2
import os
import numpy as np

def pdf_to_images(pdf_path, output_folder):
    # Convert PDF to a list of images
    images = convert_from_path(pdf_path)

    # Get the base filename without extension
    filename = os.path.splitext(os.path.basename(pdf_path))[0]

    # Iterate through each page of the PDF
    for page_number, image in enumerate(images):
        # Convert the page image to OpenCV format
        opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        # Convert to grayscale
        gray = cv2.cvtColor(opencv_image, cv2.COLOR_BGR2GRAY)

        # Apply Canny edge detection
        edges = cv2.Canny(gray, 60, 100)

        # Find contours in the edge image
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        # Extract subimages based on contours
        saved_rectangles = []
        for i, contour in enumerate(contours):
            # Get bounding rectangle of each contour
            x, y, w, h = cv2.boundingRect(contour)

            # Check if the dimensions are above 150 by 150
            if w > 150 and h > 150:
                # Check if the current rectangle overlaps with previously saved rectangles
                overlaps = any(
                    x1 < (x + w) and (x1 + w1) > x and y1 < (y + h) and (y1 + h1) > y
                    for x1, y1, w1, h1 in saved_rectangles
                )

                if not overlaps:
                    # Extract subimage from the original image
                    subimage = opencv_image[y:y + h, x:x + w]

                    # Save subimage to the output folder
                    output_path = os.path.join(output_folder, f"{filename}_page_{page_number + 1}_subimage_{i}.png")
                    cv2.imwrite(output_path, subimage)

                    # Update the list of saved rectangles
                    saved_rectangles.append((x, y, w, h))

        print(f"Subimages saved for {filename}, page {page_number + 1}")

# Example usage
pdf_path = "pdf2 ned.pdf"
output_folder = "Test_out" 
pdf_to_images(pdf_path, output_folder)
