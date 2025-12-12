from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from users.models import UserProfile
from teams.models import Team
from activities.models import Activity
from leaderboards.models import LeaderboardEntry
from datetime import date, timedelta

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Delete existing data
        Activity.objects.all().delete()
        LeaderboardEntry.objects.all().delete()
        Team.objects.all().delete()
        UserProfile.objects.all().delete()
        User.objects.all().delete()

        # Create users (super heroes)
        marvel_heroes = [
            {'username': 'ironman', 'email': 'ironman@marvel.com', 'first_name': 'Tony', 'last_name': 'Stark'},
            {'username': 'captainamerica', 'email': 'cap@marvel.com', 'first_name': 'Steve', 'last_name': 'Rogers'},
            {'username': 'spiderman', 'email': 'spidey@marvel.com', 'first_name': 'Peter', 'last_name': 'Parker'},
        ]
        dc_heroes = [
            {'username': 'batman', 'email': 'batman@dc.com', 'first_name': 'Bruce', 'last_name': 'Wayne'},
            {'username': 'superman', 'email': 'superman@dc.com', 'first_name': 'Clark', 'last_name': 'Kent'},
            {'username': 'wonderwoman', 'email': 'wonderwoman@dc.com', 'first_name': 'Diana', 'last_name': 'Prince'},
        ]
        users = []
        for hero in marvel_heroes + dc_heroes:
            user = User.objects.create_user(
                username=hero['username'],
                email=hero['email'],
                password='password',
                first_name=hero['first_name'],
                last_name=hero['last_name']
            )
            users.append(user)
            UserProfile.objects.create(user=user, fitness_level='intermediate', bio=f"{hero['first_name']} {hero['last_name']} is a superhero.")

        # Create teams
        marvel_team = Team.objects.create(name='Team Marvel', description='Earth’s Mightiest Heroes', captain=users[0])
        dc_team = Team.objects.create(name='Team DC', description='Justice League', captain=users[3])
        for user in users[:3]:
            marvel_team.members.add(user)
        for user in users[3:]:
            dc_team.members.add(user)

        # Create activities
        today = date.today()
        for i, user in enumerate(users):
            Activity.objects.create(
                user=user,
                activity_type='running',
                duration=30 + i*5,
                distance=5 + i,
                calories=300 + i*20,
                notes='Morning run',
                date=today - timedelta(days=i)
            )
            Activity.objects.create(
                user=user,
                activity_type='cycling',
                duration=45 + i*3,
                distance=15 + i*2,
                calories=400 + i*25,
                notes='Evening ride',
                date=today - timedelta(days=i+1)
            )

        # Create leaderboard entries
        for i, user in enumerate(users):
            LeaderboardEntry.objects.create(
                user=user,
                period='weekly',
                total_activities=2,
                total_duration=75 + i*8,
                total_distance=20 + i*3,
                total_calories=700 + i*45,
                rank=i+1,
                period_start=today - timedelta(days=today.weekday()),
                period_end=today
            )

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data!'))
