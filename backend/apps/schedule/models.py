from django.db import models


class WorkingDay(models.Model):
    class Weekday(models.IntegerChoices):
        MONDAY = 0, 'Monday'
        TUESDAY = 1, 'Tuesday'
        WEDNESDAY = 2, 'Wednesday'
        THURSDAY = 3, 'Thursday'
        FRIDAY = 4, 'Friday'
        SATURDAY = 5, 'Saturday'
        SUNDAY = 6, 'Sunday'

    weekday = models.PositiveSmallIntegerField(
        choices=Weekday.choices,
        unique=True,
    )
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['weekday']

    def __str__(self):
        return f'{self.get_weekday_display()}: {self.start_time} - {self.end_time}'



class DayOff(models.Model):
    date = models.DateField(unique=True)
    reason = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['-date']
        verbose_name = 'Day off'
        verbose_name_plural = 'Days off'
    
    def __str__(self):
        return f'{self.date} - {self.reason or 'Day off'}'