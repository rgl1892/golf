from rest_framework import serializers
from courses.models import Scoring, Hole, Round

class ScorecardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scoring
        fields = '__all__'
        depth = 1
        # [
        #    'id','round_number','hole','adam','alex','jaime','rich',
        #    'adam_stable','alex_stable','jaime_stable','rich_stable',
        #    'adam_to_par','alex_to_par','jaime_to_par','rich_to_par']

class HoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hole
        fields = ['course','tees','hole','yards','par','stroke_index','slope_rating']
        

class RoundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Round
        fields = ['id','course','tees','round_number']
        
