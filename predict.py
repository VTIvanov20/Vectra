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
