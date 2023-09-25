from django.urls import path
from . import views

urlpatterns = [
    path('scorecards',views.ScoreCard.as_view()),
    path('holes',views.HoleData.as_view()),
    path('rounds',views.RoundData.as_view()),
]