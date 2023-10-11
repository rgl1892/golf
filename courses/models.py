from django.db import models

class Hole(models.Model):
    course = models.CharField(max_length=10)
    tees = models.CharField(max_length=7)
    hole = models.IntegerField(default=1)
    yards = models.IntegerField(default=200)
    par = models.IntegerField(default=4)
    stroke_index = models.IntegerField(default=1)   
    slope_rating = models.IntegerField(default=113)  
    
    def __str__(self) -> str:
        return str(self.course)+": "+str(self.tees) + " Hole " + str(self.hole)


class Round(models.Model):
    course = models.CharField(max_length=10)
    tees = models.CharField(max_length=7)
    round_number = models.IntegerField(default=1)
    pair = models.CharField(max_length=20,default='Adam & Alex')

    def __str__(self) -> str:
        return 'Round ' + str(self.round_number) + ' ' + str(self.course) + ' : ' + str(self.tees) + ' tees'

class Player(models.Model):
    player = models.CharField(max_length=10)
    handicap_index = models.FloatField()

    def __str__(self) -> str:
        return self.player
       
class Scoring(models.Model):
    round_number = models.ForeignKey(Round,on_delete=models.CASCADE)
    hole = models.ForeignKey(Hole,on_delete=models.CASCADE)
    adam = models.IntegerField(null=True,blank=True)
    alex = models.IntegerField(null=True,blank=True)
    jaime = models.IntegerField(null=True,blank=True)
    rich = models.IntegerField(null=True,blank=True)
    adam_stable = models.IntegerField(null=True,blank=True)
    alex_stable = models.IntegerField(null=True,blank=True)
    jaime_stable = models.IntegerField(null=True,blank=True)
    rich_stable = models.IntegerField(null=True,blank=True)
    adam_to_par = models.IntegerField(null=True,blank=True)
    alex_to_par = models.IntegerField(null=True,blank=True)
    jaime_to_par = models.IntegerField(null=True,blank=True)
    rich_to_par = models.IntegerField(null=True,blank=True)
    sandies = models.CharField(max_length=10,default='')
    match_play = models.IntegerField(null=True,blank=True)
    match_play_total = models.IntegerField(null=True,blank=True)
    better_ball_team_a = models.IntegerField(null=True,blank=True)
    better_ball_team_b = models.IntegerField(null=True,blank=True)

    def __str__(self) -> str:
        return str(self.round_number) + ' : ' + str(self.hole)
    


