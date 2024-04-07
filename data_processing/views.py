import os
import pandas as pd
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from DataDazzle.serializers import UploadedFileSerializer
from django.core.files.storage import FileSystemStorage
from .utils.handle_data import infer_and_convert_data_types
from .models import UploadedFile, ProcessedData

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

        # Create instances of the ProcessedData model for each column
        for column_name, data_type in df.dtypes.items():
            ProcessedData.objects.create(
                file=uploaded_file,
                column_name=column_name,
                data_type=str(data_type)
            )

        data_type_mapping = {
        'object': 'Text',
        'int64': 'Integer',
        'float64': 'Float',
        'bool': 'Boolean',
        'datetime64': 'Date',
        'timedelta64[ns]': 'Time Delta',
        'category': 'Category'
    }

        user_friendly_data_types = {}
        for column_name, data_type in df.dtypes.items():
            user_friendly_type = data_type_mapping.get(str(data_type), str(data_type))
            user_friendly_data_types[column_name] = user_friendly_type

        print("\nData types after inference:")
        # print(df)
        print(df.dtypes)
        print(user_friendly_data_types)

        # Remove the temporary file
        os.remove(temp_file_path)

        serializer = UploadedFileSerializer(uploaded_file)
        return Response(user_friendly_data_types, status=status.HTTP_200_OK)
