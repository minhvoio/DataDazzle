from rest_framework import serializers

class FileUploadSerializers(serializers.Serializer):
  file = serializers.FileField()