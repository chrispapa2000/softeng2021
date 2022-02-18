# adds new passes from a using a received.csv file stored in /received

import sys
import mariadb
import csv

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
    #print(ret)
    return ret

def main():

    # connect to database

    try:
        conn = mariadb.connect(
            user="tolltrolls",
            password="diakopeskantere",
            host="tolltrolls.tk",
            port=3306, #???
            database="tolltrolls"
        )

    except mariadb.Error as e:
        #print(f"Error connecting to MariaDB Platform: {e}")
        #print("unhealthy")
        print(e)
        sys.exit(1)

    # Get Cursor
    cur = conn.cursor()

    # get all keys so that you use unique primary keys
    cur.execute("SELECT Charge_id FROM charge")
    temp = cur.fetchall()
    charge_keys = [item[0] for item in temp]

    cur.execute("SELECT Pass_id FROM Pass")
    temp = cur.fetchall()
    pass_keys = [item[0] for item in temp]


    statement = "SET FOREIGN_KEY_CHECKS = 0"
    cur.execute(statement)
    conn.commit()

    # process given csv file according to database schema

    try:
        file = open("received/new_passes.csv")
        csvreader = csv.reader(file)
        header = next(csvreader)

        file2 = open("received/received_charges.csv", 'w', newline="")
        charges = csv.writer(file2)
        #charges.writerow(['Charge_id', 'Charge_amount', 'PassPass_id'])

        file3 = open("received/received_passes.csv", 'w', newline="")
        passes = csv.writer(file3)
        #passes.writerow(['Pass_id', 'Timestamp', 'vehicleVehicle_ref', 'stationStation_id'])
    except OSError as e:
        print(e)
        sys.exit(1)


    #print(header)
    rows1 = []
    rows2 = []
    if (charge_keys):
        n = max(charge_keys)
    else:
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
    file3.close()

    """do some work"""

    try:
        #station
        #this path is the path from the api folder, where the js file that runs this script resides
        file = open("received/received_passes.csv", 'r')
    except OSError as e:
        print(e)
        sys.exit(1)

    csvreader = csv.reader(file)
    for row in csvreader:
        if (row[0] in pass_keys):
            print("duplicate primary key error")
            exit(1)

    dataset = list(csvreader)
    statement = "INSERT INTO Pass (Pass_id, Timestamp, vehicleVehicle_ref, stationStation_id, companyCompany_abbr) VALUES (%s, %s, %s, %s, %s)"
    cur.executemany(statement, dataset)
    conn.commit()
    file.close()

    try:
        file = open("received/received_charges.csv")
    except OSError as e:
        print(e)
        sys.exit(1)

    csvreader = csv.reader(file)
    dataset = list(csvreader)
    statement = "INSERT INTO charge (Charge_id, Charge_amount, PassPass_id) VALUES (%s, %s, %s)"
    cur.executemany(statement, dataset)
    conn.commit()
    file.close()

    statement = "SET FOREIGN_KEY_CHECKS = 1"
    cur.execute(statement)
    conn.commit()

    conn.close()

main()
