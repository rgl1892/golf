from django.shortcuts import render
from .models import Vids



def view_vids(request):
    vid = Vids.objects.all()
    return render(request,'videos/view.html',{'vids':vid})



