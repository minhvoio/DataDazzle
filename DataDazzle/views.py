from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import FileUploadSerializers

class FileUploadView(APIView):
  def post(self, request, *args, **kwargs):
    serializer = FileUploadSerializers(data = request.data)

    if serializer.is_valid():
      file = serializer.validated_data['file']

      print('File: ', file)

      return Response({'message': 'File uploaded successfully'}, status = status.HTTP_200_OK)
    else:
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    