"""
URL configuration for golf_trip project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path ,include
from courses import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home,name='home'),
    path('round/', views.round_choice,name='round'),
    path('scoringreadlist/', views.scoringreadlist ,name='scoringreadlist'),
    path('scoringread/<int:round_number>/', views.scoringReadRound,name='scoringreadround'),
    path('scoring/<int:round_number>/', views.scoringview,name='scoringview'),
    path('scoring/', views.scoring,name='scoring'),
    path('edit_score/', views.edit_score,name='edit_score'),
    path('sign_up_user/', views.signUpUser,name='sign_up_user'),
    path('logout/', views.logOutUser,name='logoutuser'),
    path('login/', views.logInUser,name='loginuser'),
    path('stats/', views.stats,name='stats'),
    path('score_stats/', views.score_stats,name='score_stats'),

    #API
    path('api/',include('api.urls')),

]
