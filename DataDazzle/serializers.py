from rest_framework import serializers
from data_processing.models import UploadedFile, ProcessedData

class UploadedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFile
        fields = ['file_name', 'file_path', 'uploaded_at']
        read_only_fields = ['file_path', 'uploaded_at']

class ProcessedDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessedData
        fields = ['id', 'column_name', 'data_type', 'user_defined_type']