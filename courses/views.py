from django.shortcuts import render, get_object_or_404, redirect
from .models import Hole, Round, Scoring, Player
from django.core import serializers
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import permission_required




def home(request):
    course = Hole.objects.all()

    names = Hole.objects.values('course').distinct()
    u = request.user.get_user_permissions()
    user = list(u)
    if 'courses.change_scoring' in user:
        rights = 'edit'
    else:
        rights = 'access'
    
    round = Round.objects.all()
    each = []
    each2 = []
    for x in round:
        data = Scoring.objects.filter(round_number=x)
        for score in data:
            each.append([score.adam, score.alex, score.jaime, score.rich, score.adam_stable,
                        score.alex_stable, score.jaime_stable, score.rich_stable, x])
    course = ''
    adam_sum = 0
    alex_sum = 0
    jaime_sum = 0
    rich_sum = 0
    adam_sum_stable = 0
    alex_sum_stable = 0
    jaime_sum_stable = 0
    rich_sum_stable = 0

    for row in each:
        
        if course != row[8]:
            each2.append([course, adam_sum, alex_sum, jaime_sum, rich_sum,
                          adam_sum_stable, alex_sum_stable, jaime_sum_stable, rich_sum_stable])
            adam_sum = row[0]
            alex_sum = row[1]
            jaime_sum = row[2]
            rich_sum = row[3]
            adam_sum_stable = row[4]
            alex_sum_stable = row[5]
            jaime_sum_stable = row[6]
            rich_sum_stable = row[7]
            course = row[8]
        else:
            try:
                adam_sum += row[0]
            except:
                None
            try:
                alex_sum += row[1]
            except:
                None
            try:
                jaime_sum += row[2]
            except:
                None
            try:
                rich_sum += row[3]
            except:
                None
            try:
                adam_sum_stable += row[4]
            except:
                None
            try:
                alex_sum_stable += row[5]
            except:
                None
            try:
                jaime_sum_stable += row[6]
            except:
                None
            try:
                rich_sum_stable += row[7]
            except:
                None
            
            
    each2.append([course, adam_sum, alex_sum, jaime_sum, rich_sum,
                 adam_sum_stable, alex_sum_stable, jaime_sum_stable, rich_sum_stable])
    each2 = each2[1:]
    adam = [value[5] for value in each2]
    alex = [value[6] for value in each2]
    jaime = [value[7] for value in each2]
    rich = [value[8] for value in each2]
    adam_ock = sum(sorted([i for i in adam if i != None])[-3:])
    alex_ock = sum(sorted([i for i in alex if i != None])[-3:])
    jaime_ock = sum(sorted([i for i in jaime if i != None])[-3:])
    rich_ock = sum(sorted([i for i in rich if i != None])[-3:])
    adam_all = sum(sorted([i for i in adam if i != None]))
    alex_all = sum(sorted([i for i in alex if i != None]))
    jaime_all = sum(sorted([i for i in jaime if i != None]))
    rich_all = sum(sorted([i for i in rich if i != None]))
    totals = [adam_ock,alex_ock,jaime_ock,rich_ock,adam_all,alex_all,jaime_all,rich_all]

    return render(request, 'courses/home.html', {'courses': course, 'names': names, 'edit_rights': rights,'each': each2,'total':totals})


def round_choice(request):

    if request.method == "GET":

        if request.GET.get('course') == 'oconnor':
            course = 'Oconnor'
        else:
            course = 'Faldo'

        if request.GET.get('tees') == 'white':
            tees = 'White'
        else:
            tees = 'Yellow'

        data = Hole.objects.filter(course=course, tees=tees)

        return render(request, 'courses/round.html', {'course': course, 'tees': tees, 'card': data})

    if request.method == 'POST':

        course = request.POST['course'].title()
        tees = request.POST['tees'].title()

        data = Hole.objects.filter(course=course, tees=tees)
        try:
            round = max(Round.objects.values_list('round_number', flat=True))+1
        except:
            round = 1

        new_round = Round(round_number=round, course=course, tees=tees)
        new_round.save()
        x = 0
        for x in range(18):
            hole_id = Hole.objects.filter(course=course, tees=tees)[x]
            new_scoring = Scoring(round_number=new_round, hole=hole_id)
            new_scoring.save()

        return render(request, 'courses/round.html', {'course': course, 'tees': tees, 'card': data, 'round_number': round})


def scoringview(request, round_number):
    round = Round.objects.all()[round_number-1]
    data = Scoring.objects.filter(round_number=round)

    return render(request, 'courses/scoringview.html', {'card': data, 'round': round })


def scoringReadlistRound(request, round_number):
    round_choice = Round.objects.all()[round_number-1]
    data = Scoring.objects.filter(round_number=round_choice)
    total = Scoring.objects.filter(round_number=round_choice).values()
    total_table = {'adam': {'total': 0, 'par': 0, 'stable': 0},
                   'alex': {'total': 0, 'par': 0, 'stable': 0},
                   'jaime': {'total': 0, 'par': 0, 'stable': 0},
                   'rich': {'total': 0, 'par': 0, 'stable': 0},
                   'match_play':0,'team_a':0,'team_b':0,
                   'match_play_total':0}

    for row in total:
        if row['adam']:
            total_table['adam']['total'] += int(row['adam'])
            total_table['adam']['par'] += int(row['adam_to_par'])
            total_table['adam']['stable'] += int(row['adam_stable'])
        if row['alex']:
            total_table['alex']['total'] += int(row['alex'])
            total_table['alex']['par'] += int(row['alex_to_par'])
            total_table['alex']['stable'] += int(row['alex_stable'])
        if row['jaime']:
            total_table['jaime']['total'] += int(row['jaime'])
            total_table['jaime']['par'] += int(row['jaime_to_par'])
            total_table['jaime']['stable'] += int(row['jaime_stable'])
        if row['rich']:
            total_table['rich']['total'] += int(row['rich'])
            total_table['rich']['par'] += int(row['rich_to_par'])
            total_table['rich']['stable'] += int(row['rich_stable'])
        total_table['match_play']  += row['match_play']
        total_table['team_a']  += row['better_ball_team_a']
        total_table['team_b']  += row['better_ball_team_b']
        total_table['match_play_total'] = total_table['match_play_total'] + row['match_play']
    pairs = round_choice.pair
    if pairs == 'Adam & Alex':
        a_team_name = 'Adam & Alex'
        b_team_name = 'Jaime & Rich'               
    elif pairs == 'Adam & Jaime':
        a_team_name = 'Adam & Jaime'
        b_team_name = 'Alex & Rich'
    else:
        a_team_name = 'Adam & Rich'
        b_team_name = 'Jaime & Alex'
    teams = [a_team_name,b_team_name]

    return render(request, 'courses/scoringReadlistRound.html', {'card': data, 'round': str(data[0])[:str(data[0]).find(":")], 'total': total_table,'teams':teams })


def scoring(request):
    round = Round.objects.all()

    # If slope rating changes, use this
    # holes = Hole.objects.all()
    # for x in holes:
    #     if x.tees == 'Yellow' and x.course == 'Faldo':
    #         x.slope_rating = 132
    #     if x.tees == 'Yellow' and x.course == 'Oconnor':
    #         x.slope_rating = 128
    #     if x.tees == 'White' and x.course == 'Faldo':
    #         x.slope_rating = 137
    #     if x.tees == 'White' and x.course == 'Oconnor':
    #         x.slope_rating = 132
    #     x.save()
    each = []
    adam = []
    alex = []
    jaime = []
    rich = []
    each2 = []
    for x in round:
        data = Scoring.objects.filter(round_number=x)
        for score in data:
            each.append([score.adam, score.alex, score.jaime, score.rich, score.adam_stable,
                        score.alex_stable, score.jaime_stable, score.rich_stable, x])
    course = ''
    adam_sum = 0
    alex_sum = 0
    jaime_sum = 0
    rich_sum = 0
    adam_sum_stable = 0
    alex_sum_stable = 0
    jaime_sum_stable = 0
    rich_sum_stable = 0

    for row in each:

        if course != row[8]:
            each2.append([course, adam_sum, alex_sum, jaime_sum, rich_sum,
                          adam_sum_stable, alex_sum_stable, jaime_sum_stable, rich_sum_stable])
            adam_sum = row[0]
            alex_sum = row[1]
            jaime_sum = row[2]
            rich_sum = row[3]
            adam_sum_stable = row[4]
            alex_sum_stable = row[5]
            jaime_sum_stable = row[6]
            rich_sum_stable = row[7]
            course = row[8]
        else:
            try:
                adam_sum += row[0]
            except:
                None
            try:
                alex_sum += row[1]
            except:
                None
            try:
                jaime_sum += row[2]
            except:
                None
            try:
                rich_sum += row[3]
            except:
                None
            try:
                adam_sum_stable += row[4]
            except:
                None
            try:
                alex_sum_stable += row[5]
            except:
                None
            try:
                jaime_sum_stable += row[6]
            except:
                None
            try:
                rich_sum_stable += row[7]
            except:
                None
    each2.append([course, adam_sum, alex_sum, jaime_sum, rich_sum,
                 adam_sum_stable, alex_sum_stable, jaime_sum_stable, rich_sum_stable])
    each2 = each2[1:]

    pair = Round.objects.all()

    return render(request, 'courses/scoring.html', {'round': round, 'each': each2,'pair':pair})


def scoringreadlist(request):
    round = Round.objects.all()
    return render(request, 'courses/scoringreadlist.html', {'round': round})


def edit_score(request):
    adam = dict(request.POST.lists())['adam']
    alex = dict(request.POST.lists())['alex']
    jaime = dict(request.POST.lists())['jaime']
    rich = dict(request.POST.lists())['rich']
    # if round_number:
    #     chosen_round= round_number
    # else:
    chosen_round = dict(request.POST.lists())['round']
    chosen_round = str(chosen_round)[8]
    round_choice = Round.objects.all()[int(chosen_round)-1]
    tees = Round.objects.all().values()[int(chosen_round)-1]['tees']

    course = str(round_choice)[7:str(round_choice).find(':')].strip()
    slope_rating = Hole.objects.filter(
        tees=tees, course=course, hole=1)[0].slope_rating
    handicap_index = {
        'adam_index': Player.objects.all()[1].handicap_index,
        'alex_index': Player.objects.all()[0].handicap_index,
        'jaime_index': Player.objects.all()[2].handicap_index,
        'rich_index': Player.objects.all()[3].handicap_index,
    }
    pairs = round_choice.pair

    stableford_points = {
        '2': 0,
        '1': 1,
        '0': 2,
        '-1': 3,
        '-2': 4,
        '-3': 5,
        '-4': 6,
        '-5': 7,
        '-6': 8,
        '-7': 9,
    }

    # create the tables for each player. There must be a better way to this this, rather than
    # just doing it 4 times
    log = []
    for index, score in enumerate(zip(adam, alex, jaime, rich), start=1):
        playing_handicap = {
            'adam_handicap': round(handicap_index['adam_index']*(slope_rating/113)*0.95),
            'alex_handicap': round(handicap_index['alex_index']*(slope_rating/113)*0.95),
            'jaime_handicap': round(handicap_index['jaime_index']*(slope_rating/113)*0.95),
            'rich_handicap': round(handicap_index['rich_index']*(slope_rating/113)*0.95),
        }

        hole = Hole.objects.filter(tees=tees, course=course, hole=index)[0]
        data = Scoring.objects.get(round_number=round_choice, hole=hole)
        try:
            prev_hole = Hole.objects.filter(tees=tees, course=course, hole=index-1)[0]
            prev_data = Scoring.objects.get(round_number=round_choice, hole=prev_hole)
        except:
            prev_hole = None
            prev_data = None
        if score[0]:
            data.adam = score[0]
            data.adam_to_par = int(score[0]) - int(hole.par)
            if playing_handicap['adam_handicap'] > 18:
                extra = 1
                playing_handicap['adam_handicap'] = playing_handicap['adam_handicap'] - 18
            else:
                extra = 0
            if int(hole.stroke_index) <= int(playing_handicap['adam_handicap']):
                hole_par = int(hole.par) + 1 + extra
            else:
                hole_par = int(hole.par) + extra
            stable_diff = int(score[0]) - int(hole_par)
            try:
                data.adam_stable = stableford_points[str(stable_diff)]
            except:
                data.adam_stable = 0
        else:
            data.adam = None
            data.adam_stable = None
            data.adam_to_par = None

        if score[1]:
            data.alex = score[1]
            data.alex_to_par = int(score[1]) - int(hole.par)
            if playing_handicap['alex_handicap'] > 18:
                extra = 1
                playing_handicap['alex_handicap'] = playing_handicap['alex_handicap'] - 18
            else:
                extra = 0
            if int(hole.stroke_index) <= int(playing_handicap['alex_handicap']):
                hole_par = int(hole.par) + 1 + extra
            else:
                hole_par = int(hole.par) + extra
            stable_diff = int(score[1]) - int(hole_par)
            try:
                data.alex_stable = stableford_points[str(stable_diff)]
            except:
                data.alex_stable = 0
        else:
            data.alex = None
            data.alex_stable = None
            data.alex_to_par = None

        if score[2]:
            data.jaime = score[2]
            data.jaime_to_par = int(score[2]) - int(hole.par)
            if playing_handicap['jaime_handicap'] > 18:
                extra = 1
                playing_handicap['jaime_handicap'] = playing_handicap['jaime_handicap'] - 18
            else:
                extra = 0
            if int(hole.stroke_index) <= int(playing_handicap['jaime_handicap']):
                hole_par = int(hole.par) + 1 + extra
            else:
                hole_par = int(hole.par) + extra
            stable_diff = int(score[2]) - int(hole_par)
            try:
                data.jaime_stable = stableford_points[str(stable_diff)]
            except:
                data.jaime_stable = 0
        else:
            data.jaime = None
            data.jaime_stable = None
            data.jaime_to_par = None

        if score[3]:
            data.rich = score[3]
            data.rich_to_par = int(score[3]) - int(hole.par)
            if playing_handicap['rich_handicap'] > 18:
                extra = 1
                playing_handicap['rich_handicap'] = playing_handicap['rich_handicap'] - 18

            else:
                extra = 0
            if int(hole.stroke_index) <= int(playing_handicap['rich_handicap']):
                hole_par = int(hole.par) + 1 + extra

            else:
                hole_par = int(hole.par) + extra
            stable_diff = int(score[3]) - int(hole_par)
            log.append(hole_par)
            try:
                data.rich_stable = stableford_points[str(stable_diff)]
            except:
                data.rich_stable = 0
        else:
            data.rich = None
            data.rich_stable = None
            data.rich_to_par = None

        if pairs == 'Adam & Alex':
            a_team_name = 'Adam & Alex'
            b_team_name = 'Jaime & Rich'
            a_team = sorted([data.adam_stable,data.alex_stable])[-1]
            b_team = sorted([data.jaime_stable,data.rich_stable])[-1]                
        elif pairs == 'Adam & Jaime':
            a_team_name = 'Adam & Jaime'
            b_team_name = 'Alex & Rich'
            a_team = sorted([data.adam_stable,data.jaime_stable])[-1]
            b_team = sorted([data.alex_stable,data.rich_stable])[-1]
        else:
            a_team_name = 'Adam & Rich'
            b_team_name = 'Jaime & Alex'
            a_team = sorted([data.adam_stable,data.rich_stable])[-1]
            b_team = sorted([data.jaime_stable,data.alex_stable])[-1]
        if a_team > b_team:
            data.match_play = +1
        elif a_team < b_team:
            data.match_play = -1
        else:
            data.match_play = 0
        teams = [a_team_name,b_team_name]
        data.better_ball_team_a = a_team
        data.better_ball_team_b = b_team
        try:
            data.match_play_total = prev_data.match_play_total + data.match_play
        except:
            data.match_play_total = data.match_play

        
        data.save()
    

 
    # create totals at bottom of table

    total = Scoring.objects.filter(round_number=round_choice).values()
    total_table = {'adam': {'total': 0, 'par': 0, 'stable': 0},
                   'alex': {'total': 0, 'par': 0, 'stable': 0},
                   'jaime': {'total': 0, 'par': 0, 'stable': 0},
                   'rich': {'total': 0, 'par': 0, 'stable': 0},
                   'match_play':0,'team_a':0,'team_b':0,
                   'match_play_total':0}

    for row in total:
        if row['adam']:
            total_table['adam']['total'] += int(row['adam'])
            total_table['adam']['par'] += int(row['adam_to_par'])
            total_table['adam']['stable'] += int(row['adam_stable'])
        if row['alex']:
            total_table['alex']['total'] += int(row['alex'])
            total_table['alex']['par'] += int(row['alex_to_par'])
            total_table['alex']['stable'] += int(row['alex_stable'])
        if row['jaime']:
            total_table['jaime']['total'] += int(row['jaime'])
            total_table['jaime']['par'] += int(row['jaime_to_par'])
            total_table['jaime']['stable'] += int(row['jaime_stable'])
        if row['rich']:
            total_table['rich']['total'] += int(row['rich'])
            total_table['rich']['par'] += int(row['rich_to_par'])
            total_table['rich']['stable'] += int(row['rich_stable'])
        total_table['match_play']  += int(row['match_play'])
        total_table['team_a']  += int(row['better_ball_team_a'])
        total_table['team_b']  += int(row['better_ball_team_b'])
        total_table['match_play_total'] = total_table['match_play_total'] + int(row['match_play'])

        

    playing_handicap = {
        'adam_handicap': round(handicap_index['adam_index']*(slope_rating/113)*0.95),
        'alex_handicap': round(handicap_index['alex_index']*(slope_rating/113)*0.95),
        'jaime_handicap': round(handicap_index['jaime_index']*(slope_rating/113)*0.95),
        'rich_handicap': round(handicap_index['rich_index']*(slope_rating/113)*0.95),
    }

    data = Scoring.objects.filter(round_number=round_choice)
    hole = hole.stroke_index
    return render(request, 'courses/scoringview.html', {'card': data, 'round': round_choice, 'total': total_table, 'handicap': playing_handicap,
                                                        'log': log, 'tees': tees,'teams':teams})


def signUpUser(request):
    if request.method == 'GET':

        return render(request, 'courses/signUpUser.html', {'form': UserCreationForm()})

    else:
        if request.POST['password1'] == request.POST['password2']:
            try:
                user = User.objects.create_user(
                    request.POST['username'], password=request.POST['password1'])
                user.save()
                login(request, user)
                return redirect('home')
            except IntegrityError:
                return render(request, 'courses/signUpUser.html', {'form': UserCreationForm(), 'error': 'Username Already Taken'})

        else:

            return render(request, 'courses/signUpUser.html', {'form': UserCreationForm(), 'error': 'Passwords did not match'})


def logOutUser(request):
    if request.method == 'POST':
        logout(request)
        return redirect('home')
    else:
        return redirect('home')


def logInUser(request):
    if request.method == 'GET':
        return render(request, 'courses/login.html', {'form': AuthenticationForm()})

    else:
        user = authenticate(
            request, username=request.POST['username'], password=request.POST['password'])
        if user == None:
            return render(request, 'courses/login.html', {'form': AuthenticationForm(), 'error': 'Unknown User / Incorrect Password'})
        else:
            login(request, user)
            return redirect('home')


def scoringviewread(request):

    return render(request, 'courses/scoringviewread.html', {'info': request.user})


def stats(request):
    rounds = Round.objects.all()
    return render(request, 'courses/stats.html', {'rounds': rounds})


def score_stats(request):
    rounds = Round.objects.all()
    return render(request, 'courses/score_stats.html', {'rounds': rounds})

def round_stats(request):
    rounds = Round.objects.all()
    return render(request, 'courses/round_stats.html', {'rounds': rounds}) 