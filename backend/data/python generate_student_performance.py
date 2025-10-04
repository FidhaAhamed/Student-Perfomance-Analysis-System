import csv
import random

first_names = [
    "John", "Jane", "Alex", "Emily", "Michael", "Sarah", "Chris", "Jessica",
    "David", "Sophia", "Daniel", "Olivia", "Matthew", "Emma", "Andrew", "Ava",
    "Joshua", "Isabella", "Ryan", "Mia", "Luke", "Ella", "Benjamin", "Lily",
    "Samuel", "Charlotte", "Jack", "Grace", "Ethan", "Amelia", "Nathan", "Zoe",
    "Aaron", "Madison", "Jacob", "Chloe", "Tyler", "Layla", "Logan", "Hannah",
    "William", "Victoria", "Gabriel", "Samantha", "Elijah", "Nora", "Henry", "Scarlett",
    "Mason", "Abigail", "Sebastian", "Penelope", "Owen", "Avery", "Julian", "Camila",
    "Leo", "Aria", "Adam", "Riley", "Isaac", "Zoey", "Anthony", "Luna", "Thomas", "Sophie",
    "Joseph", "Harper", "Robert", "Mila", "Charles", "Aurora", "James", "Brooklyn"
]

last_names = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
    "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
    "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young",
    "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
    "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker",
    "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales", "Murphy",
    "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson", "Bailey",
    "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson"
]

def random_name():
    return f"{random.choice(first_names)} {random.choice(last_names)}"

def determine_performance(attendance, assignments, tutorials, volunteering, moocs, eventparticipation):
    if attendance >= 75:
        if assignments >= 7:
            if tutorials >= 3:
                if volunteering >= 2:
                    if moocs >= 1:
                        if eventparticipation >= 3:
                            return 'High'
                        else:
                            return 'Medium'
                    else:
                        return 'Medium'
                else:
                    return 'Medium'
            else:
                return 'Medium'
        else:
            return 'Medium'
    else:
        return 'Low'

rows = []
for i in range(1000):
    student_id = f"S{i+1:04d}"
    name = random_name()
    attendance = random.randint(55, 100)  # 55-100%
    assignments = random.randint(7, 10)
    tutorials = random.randint(1, 5)
    volunteering = random.randint(0, 5)
    moocs = random.randint(0, 3)
    eventparticipation = random.randint(2, 5)
    performance = determine_performance(attendance, assignments, tutorials, volunteering, moocs, eventparticipation)
    rows.append([
        student_id, name, attendance, assignments, tutorials, volunteering, moocs, eventparticipation, performance
    ])

with open('student_performance.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['StudentID', 'Name', 'Attendance', 'Assignments', 'Tutorials', 'Volunteering', 'MOOCs', 'EventsParticipation', 'PerformanceLevel'])
    writer.writerows(rows)

print("CSV file generated: student_performance.csv")