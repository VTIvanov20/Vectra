from azure.cognitiveservices.vision.customvision.training import CustomVisionTrainingClient
from azure.cognitiveservices.vision.customvision.prediction import CustomVisionPredictionClient
from azure.cognitiveservices.vision.customvision.training.models import ImageFileCreateBatch, ImageFileCreateEntry, Region
from msrest.authentication import ApiKeyCredentials
import os, time, uuid
import dotenv

load_dotenv()

# Replace with valid values
ENDPOINT = os.getenv("ENDPOINT")
prediction_key = os.getenv("PREDICTION_KEY")
prediction_resource_id = os.getenv("PREDICTION_RESOURCE_ID")

prediction_credentials = ApiKeyCredentials(in_headers={"Prediction-key": prediction_key})
predictor = CustomVisionPredictionClient(ENDPOINT, prediction_credentials)

projectId = os.getenv("PROJECT_ID")
publish_iteration_name = os.getenv("PUBLISH_ITERATION_NAME")

base_image_location = os.path.join (os.path.dirname(__file__), "Images")

# Now there is a trained endpoint that can be used to make a prediction

# Open the sample image and get back the prediction results.
with open(os.path.join (base_image_location, "tall.png"), mode="rb") as test_data:
    results = predictor.detect_image(projectId, publish_iteration_name, test_data)

XCord = []
YCord = []
Range = 0.05

# Display the results
for prediction in results.predictions:
    # Calculate the center point of the bounding box
    boxSizeW = prediction.bounding_box.width / 2
    boxSizeH = prediction.bounding_box.height / 2
    # Only print predictions with a probability greater than 50%
    if prediction.probability * 100 > 50:
        #print(prediction.tag_name + ": {0:.2f}%".format(prediction.probability * 100)) #this is if you want to know how many percent is the corner
        XCord.append(round(prediction.bounding_box.left + boxSizeH, 2))
        YCord.append(round(prediction.bounding_box.top + boxSizeW, 2))

# Iterate through the X coordinates
for indexI in range(len(XCord) - 1):
    for indexU in range(indexI + 1, len(XCord)):
        if XCord[indexI] - XCord[indexU] < Range and XCord[indexI] - XCord[indexU] > -Range :
            XCord[indexU] =  XCord[indexI]

# Iterate through the Y coordinates
for indexI in range(len(YCord) - 1):
    for indexU in range(indexI + 1, len(YCord)):
        if YCord[indexI] - YCord[indexU] < Range and YCord[indexI] - YCord[indexU] > -Range :
            YCord[indexU] = YCord[indexI]

# Print the final X and Y coordinates
for index in range(len(XCord)) :
    print(index + 1, "point cordinates: X:", XCord[index], "Y:", YCord[index])
