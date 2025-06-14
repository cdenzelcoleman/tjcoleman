# Generated by Django 5.2.1 on 2025-05-27 16:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('videos', '0003_emailsubscriber_blogpost_blogcomment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blogpost',
            name='content_type',
            field=models.CharField(choices=[('text', 'Text Only'), ('youtube', 'YouTube Video'), ('instagram', 'Instagram Video'), ('substack', 'Substack Link'), ('mixed', 'Text + Video')], default='text', max_length=10),
        ),
        migrations.AlterField(
            model_name='blogpost',
            name='video_url',
            field=models.URLField(blank=True, help_text='YouTube, Instagram, or Substack URL', null=True),
        ),
    ]
