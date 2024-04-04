import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import FileUploadSerializers
from django.core.files.storage import FileSystemStorage

import pandas as pd

def infer_and_convert_data_types(df):
    for col in df.columns:
        # Attempt to convert to numeric first
        df_converted = pd.to_numeric(df[col], errors='coerce')
        if not df_converted.isna().all():  # If at least one value is numeric
            df[col] = df_converted
            continue

        # Attempt to convert to datetime
        try:
            df[col] = pd.to_datetime(df[col])
            continue
        except (ValueError, TypeError):
            pass

        # Check if the column should be categorical
        if len(df[col].unique()) / len(df[col]) < 0.5:  # Example threshold for categorization
            df[col] = pd.Categorical(df[col])

    return df

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
      
      print(df)

      return Response({'message': 'File uploaded successfully'}, status = status.HTTP_200_OK)
    else:
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    