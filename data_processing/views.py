import os
import json
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import UploadedFile, ProcessedData
from django.core.files.storage import FileSystemStorage
from DataDazzle.serializers import UploadedFileSerializer
from .utils.handle_data import infer_and_convert_data_types, convert_to_user_friendly_type

class FileUploadView(APIView):
    def post(self, request, *args, **kwargs):
        file = request.FILES['file']
        file_name = file.name

        # Save the file to a temporary location
        fs = FileSystemStorage()
        temp_file_path = fs.save(file_name, file)

        # Process the file and infer data types
        df = infer_and_convert_data_types(temp_file_path)

        # Create an instance of the UploadedFile model
        uploaded_file = UploadedFile.objects.create(
            file_name=file_name,
            file_path=temp_file_path
        )

        user_friendly_data_types = convert_to_user_friendly_type(df)

        # Create instances of the ProcessedData model for each column
        for column_name, data_type in df.dtypes.items():
            ProcessedData.objects.create(
                file=uploaded_file,
                column_name=column_name,
                data_type=user_friendly_data_types.get(column_name)
            )
        
        # Remove the temporary file
        os.remove(temp_file_path)

        print("\nData types after inference:")
        print(df)
        # print(df.dtypes)
        print(user_friendly_data_types)

        # Convert the DataFrame to a JSON-compatible format
        df_json = json.loads(df.to_json(orient='records'))

        # Create a dictionary to hold both the DataFrame and user-friendly data types
        response_data = {
            'processed_data': df_json,
            'data_types': user_friendly_data_types
        }

        # serializer = UploadedFileSerializer(uploaded_file)
        return Response(response_data, status=status.HTTP_200_OK)
