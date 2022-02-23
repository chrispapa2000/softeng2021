import csv
import random
import hashlib
from faker import Faker
#from faker.providers import BaseProvider
fake = Faker()

def extract_time(time):
    i = 0
    day = time[i]
    i+=1
    if (time[i] == '/'):
        day = '0'+day
        i+=1
    else:
        day += time[i]
        i+=2
    month = time[i]
    i+=1
    if (time[i] == '/'):
        month = '0'+month
        i+=1
    else:
        month += time[i]
        i+=2
    year = time[i:(i+4)]
    clock = time[(i+5):(i+13)]
    ret = year+'-'+month+'-'+day+' '+clock
    print(ret)
    return ret




def main():
    file = open("sampledata01_passes100_8000.csv")
    csvreader = csv.reader(file)
    header = next(csvreader)

    file2 = open("charges.csv", 'w', newline="")
    charges = csv.writer(file2)
    #charges.writerow(['Charge_id', 'Charge_amount', 'PassPass_id'])

    file3 = open("pass.csv", 'w', newline="")
    passes = csv.writer(file3)
    #passes.writerow(['Pass_id', 'Timestamp', 'vehicleVehicle_ref', 'stationStation_id'])

    #print(header)
    rows1 = []
    rows2 = []
    n = 0
    for row in csvreader:
        n+=1

        #rows.append(row)
        temp = row[0].split(";")
        pass_id = temp[0]

        time = extract_time(temp[1])

        station = temp[2]
        station_owner = station[0:2]
        vehicle = temp[3]
        charge = temp[4]
        tag_owner = temp[7]

        rows1.append([n, charge, pass_id])
        rows2.append([pass_id, time, vehicle, station, tag_owner])


    #print(rows)
    charges.writerows(rows1)
    passes.writerows(rows2)
    file.close()
    file2.close()

    #####################################################################

    file = open("sampledata01_stations.csv")
    csvreader = csv.reader(file)
    header = next(csvreader)

    file2 = open("stations.csv", 'w', newline="")
    stations = csv.writer(file2)
    #stations.writerow(['Station_id', 'Station_name'])

    rows1 = []

    n = 0
    for row in csvreader:
        n+=1

        #rows.append(row)
        temp = row[0].split(";")
        station_id = temp[0]
        station_name = temp[2]

        rows1.append([station_id, station_name])

    stations.writerows(rows1)
    file.close()
    file2.close()

    #####################################################################

    file = open("sampledata01_vehicles_100.csv")
    csvreader = csv.reader(file)
    header = next(csvreader)

    file2 = open("vehicles.csv", 'w', newline="")
    vehs = csv.writer(file2)
    #vehs.writerow(['Vehicle_ref'])

    file3 = open("tag_vehicle.csv", 'w', newline="")
    tag_vehs = csv.writer(file3)
    #tag_vehs.writerow(['tagTag_id', 'vehicleVehicle_ref'])

    file4 = open("tag.csv", 'w', newline="")
    tag = csv.writer(file4)
    #tag.writerow(['Tag_id', 'userUser_id'])

    file5 = open("user.csv", 'w', newline="")
    user = csv.writer(file5)
    #user.writerow(['User_id', 'Username', 'Password_hash'])

    file6 = open("companies.csv", 'w', newline="")
    comps = csv.writer(file6)

    rows1 = []
    rows2 = []
    rows3 = []
    rows4 = []
    rows5 = []

    s1 = set()

    n = 0
    for row in csvreader:
        n+=1

        #rows.append(row)
        temp = row[0].split(";")
        vehicle_id = temp[0]
        tagID = temp[1]
        tag_provider = temp[2]
        provider_abbr = temp[3]
        license_year = temp[4]

        user_id = random.randint(10000,100000)
        while user_id in s1:
            user_id = random.randint(10000,100000)
        s1.add(user_id)

        username = fake.unique.user_name()
        password = hashlib.sha256(username.encode()).hexdigest()

        rows1.append([vehicle_id])
        rows2.append([tagID, vehicle_id])
        rows3.append([tagID, user_id])
        rows4.append([user_id, username, password])

    abr = ["AO", "KO", "GF", "NE", "OO", "MR", "EG"]
    name = ["aodos", "kentriki_odos", "gefyra", "nea_odos", "olympia_odos", "moreas", "egnatia"]

    #companies
    for i in range(1,8):
        user_id = i
        username = "user"+abr[i-1]
        password = hashlib.sha256(username.encode()).hexdigest()
        rows4.append([user_id, username, password])
        rows5.append([abr[i-1], name[i-1], user_id])

    # gov official
    user_id = 21
    username = "Pierrakakis"
    password = hashlib.sha256(username.encode()).hexdigest()
    rows4.append([user_id, username, password])

    #Banker
    user_id = 11
    username = "Bank1"
    password = hashlib.sha256(username.encode()).hexdigest()
    rows4.append([user_id, username, password])


    vehs.writerows(rows1)
    tag_vehs.writerows(rows2)
    tag.writerows(rows3)
    user.writerows(rows4)
    comps.writerows(rows5)
    file.close()
    file2.close()
    file3.close()
    file4.close()
    file5.close()
    file6.close()


main()
