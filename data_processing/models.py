from django.db import models
from django.contrib.auth.models import User

class UploadedFile(models.Model):
  file_name = models.CharField(max_length=255)
  file_path = models.CharField(max_length=255)
  uploaded_at = models.DateTimeField(auto_now_add=True)

class ProcessedData(models.Model):
  file = models.ForeignKey(UploadedFile, on_delete = models.CASCADE)
  column_name = models.CharField(max_length = 255)
  data_type = models.CharField(max_length = 20)
  user_defined_type = models.CharField(max_length = 20, null = True, blank = True)

  class Meta:
    unique_together = ('file', 'column_name')

  