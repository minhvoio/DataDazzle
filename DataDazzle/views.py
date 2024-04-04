import os
import pandas as pd

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import FileUploadSerializers
from django.core.files.storage import FileSystemStorage
from .utils.convert_data_types import infer_and_convert_data_types


class FileUploadView(APIView):
  def post(self, request, *args, **kwargs):
    serializer = FileUploadSerializers(data = request.data)

    if serializer.is_valid():
      file = serializer.validated_data['file']

      file_name = file.name
      file_ext = os.path.splitext(file_name)[1].lower()

      # Save the file to a temporary location
      fs = FileSystemStorage()
      temp_file_path = fs.save(file_name, file)

      if file_ext == '.csv':
          df = pd.read_csv(temp_file_path)
      elif file_ext == '.xlsx':
          df = pd.read_excel(temp_file_path)
      elif file_ext == '.xls':
          df = pd.read_excel(temp_file_path, engine='xlrd')
      else:
          return Response({'error': 'Invalid file format'}, status=status.HTTP_400_BAD_REQUEST)
      
      # print(df)    
      print("Data types before inference:")
      print(df.dtypes)    

      df = infer_and_convert_data_types(df)

      print("\nData types after inference:")
      print(df.dtypes)

      os.remove(temp_file_path)

      return Response({'message': 'File uploaded successfully'}, status = status.HTTP_200_OK)
    else:
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    