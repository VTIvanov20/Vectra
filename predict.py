"""from azure.cognitiveservices.vision.customvision.prediction import CustomVisionPredictionClient
from msrest.authentication import ApiKeyCredentials
import os
# Get path to images folder
dirname = os.path.dirname(__file__)
images_folder = os.path.join(dirname, 'images')
# Create variables for your project
publish_iteration_name = "Iteration5"
project_id = "440fe2cf-7036-4e3e-be72-f52158eabe08"
# Create variables for your prediction resource
prediction_key = "7a7f68eeec3144f2a7c14c722bd406d3"
endpoint = "https://vectramathinformations-prediction.cognitiveservices.azure.com/customvision/v3.3/Prediction/"
prediction_credentials = ApiKeyCredentials(in_headers={"Prediction-key": prediction_key})
predictor = CustomVisionPredictionClient(endpoint, prediction_credentials)
# Open an image and make a prediction
with open(os.path.join(images_folder, "cube.png"), "rb") as image_contents:
    results = predictor.classify_image(project_id, publish_iteration_name, image_contents.read())
# Display the results
for prediction in results.predictions:
    print(f"{prediction.tag_name}: {prediction.probability * 100 :.2f}%")

images = os.listdir(images_folder)
for i in range(len(images)):
    # Open the image, and use the custom vision model to classify it
    image_contents = open(os.path.join(images_folder, images[i]), "rb")
    results = predictor.classify_image(project_id, publish_iteration_name, image_contents.read())

    # Print the predicted class
    print(f"Image {images[i]}: {results.predictions[0].tag_name} {results.predictions[0].probability * 100 :.2f}% {results.predictions[0].boundingBox.left}")
"""
from azure.cognitiveservices.vision.customvision.training import CustomVisionTrainingClient
from azure.cognitiveservices.vision.customvision.prediction import CustomVisionPredictionClient
from azure.cognitiveservices.vision.customvision.training.models import ImageFileCreateBatch, ImageFileCreateEntry, Region
from msrest.authentication import ApiKeyCredentials
import os, time, uuid

# Replace with valid values
ENDPOINT = "https://vectramathinformations-prediction.cognitiveservices.azure.com/"
prediction_key = "7a7f68eeec3144f2a7c14c722bd406d3"
prediction_resource_id = "/subscriptions/a7a27936-47dc-4e4c-ab83-b2c07675638a/resourceGroups/Vectra/providers/Microsoft.CognitiveServices/accounts/VectraMathInformations"

prediction_credentials = ApiKeyCredentials(in_headers={"Prediction-key": prediction_key})
predictor = CustomVisionPredictionClient(ENDPOINT, prediction_credentials)

projectId = "440fe2cf-7036-4e3e-be72-f52158eabe08"
publish_iteration_name = "Iteration5"

base_image_location = os.path.join (os.path.dirname(__file__), "Images")

# Now there is a trained endpoint that can be used to make a prediction

# Open the sample image and get back the prediction results.
with open(os.path.join (base_image_location, "cube.png"), mode="rb") as test_data:
    results = predictor.detect_image(projectId, publish_iteration_name, test_data)

# Display the results.    
for prediction in results.predictions:
    if prediction.probability * 100 > 50:
      print("\t" + prediction.tag_name + ": {0:.2f}% bbox.left = {1:.2f}, bbox.top = {2:.2f}, bbox.width = {3:.2f}, bbox.height = {4:.2f}".format(prediction.probability * 100, prediction.bounding_box.left, prediction.bounding_box.top, prediction.bounding_box.width, prediction.bounding_box.height))