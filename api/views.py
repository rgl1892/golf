from django.shortcuts import render
from rest_framework import generics, permissions
from .serializers import ScorecardSerializer, HoleSerializer ,RoundSerializer
from courses.models import Scoring, Hole, Round

class ScoreCard(generics.ListAPIView):
    serializer_class = ScorecardSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user = self.request.user
        return Scoring.objects.all()
        

class HoleData(generics.ListAPIView):
    serializer_class = HoleSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user = self.request.user
        return Hole.objects.filter()
    
class RoundData(generics.ListAPIView):
    serializer_class = RoundSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user = self.request.user
        return Round.objects.all()

# class FilterHole(generics.RetrieveAPIView):
    