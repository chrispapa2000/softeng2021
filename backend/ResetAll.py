import sys
import mariadb
import csv

def main():

    try:
        conn = mariadb.connect(
            user="tolltrolls",
            password="123",
            host="localhost",
            port=3306, #???
            database="interoperability-db"
        )

    except mariadb.Error as e:
        #print(f"Error connecting to MariaDB Platform: {e}")
        #print("unhealthy")
        sys.exit(1)

    # Get Cursor
    cur = conn.cursor()
    statement = "SET FOREIGN_KEY_CHECKS = 0"
    cur.execute(statement)
    conn.commit()

    statement = "TRUNCATE TABLE user"
    cur.execute(statement)
    conn.commit()
    statement = "TRUNCATE TABLE Banker"
    cur.execute(statement)
    conn.commit()
    statement = "TRUNCATE TABLE vehicle"
    cur.execute(statement)
    conn.commit()
    statement = "TRUNCATE TABLE station"
    cur.execute(statement)
    conn.commit()
    statement = "TRUNCATE TABLE company"
    cur.execute(statement)
    conn.commit()
    statement = "TRUNCATE TABLE Pass"
    cur.execute(statement)
    conn.commit()
    statement = "TRUNCATE TABLE charge"
    cur.execute(statement)
    conn.commit()
    statement = "TRUNCATE TABLE Banker"
    cur.execute(statement)
    conn.commit()
    statement = "TRUNCATE TABLE government_official"
    cur.execute(statement)
    conn.commit()
    statement = "TRUNCATE TABLE tag"
    cur.execute(statement)
    conn.commit()
    statement = "TRUNCATE TABLE tag_vehicle"
    cur.execute(statement)
    conn.commit()

    statement = "SET FOREIGN_KEY_CHECKS = 1"
    cur.execute(statement)
    conn.commit()

    #user
    file = open("initial_data/user.csv")
    csvreader = csv.reader(file)
    for row in csvreader:
        statement = "INSERT INTO user (User_id, Username, Password_hash) VALUES (%s, %s, %s)"
        cur.execute(statement, row)
        conn.commit()
    file.close()

    #table Banker
    statement = "INSERT INTO Banker (Bank_id, Bank_name, userUser_id) VALUES (%s, %s, %s)"
    vals = (1, "Alpha", 11)
    cur.execute(statement, vals)
    conn.commit()

    #vehicle
    file = open("initial_data/vehicles.csv")
    csvreader = csv.reader(file)
    for row in csvreader:
        statement = "INSERT INTO vehicle (Vehicle_ref) VALUES (%s)"
        cur.execute(statement, row)
        conn.commit()
    file.close()

    #station
    file = open("initial_data/stations.csv")
    csvreader = csv.reader(file)
    for row in csvreader:
        statement = "INSERT INTO station (Station_id, Station_name) VALUES (%s, %s)"
        cur.execute(statement, row)
        conn.commit()
    file.close()

    #Company
    file = open("initial_data/companies.csv")
    csvreader = csv.reader(file)
    for row in csvreader:
        statement = "INSERT INTO company (Company_abbr, Company_name, userUser_id) VALUES (%s, %s, %s)"
        cur.execute(statement, row)
        conn.commit()
    file.close()

    #Pass
    file = open("initial_data/pass.csv")
    csvreader = csv.reader(file)
    for row in csvreader:
        statement = "INSERT INTO Pass (Pass_id, Timestamp, vehicleVehicle_ref, stationStation_id, companyCompany_abbr) VALUES (%s, %s, %s, %s, %s)"
        cur.execute(statement, row)
        conn.commit()
    file.close()

    #charge
    file = open("initial_data/charges.csv")
    csvreader = csv.reader(file)
    for row in csvreader:
        statement = "INSERT INTO charge (Charge_id, Charge_amount, PassPass_id) VALUES (%s, %s, %s)"
        cur.execute(statement, row)
        conn.commit()
    file.close()

    """
    #deposit
    file = open("initial_data/user.csv")
    csvreader = csv.reader(file)
    for row in csvreader:
        statement = "INSERT INTO user (User_id, Username, Password_hash) VALUES (%s, %s, %s)"
        cur.execute(statement, row)
        conn.commit()
    """

    #gov official
    row = (1, 21)
    statement = "INSERT INTO government_official (Gov_id, userUser_id) VALUES (%s, %s)"
    cur.execute(statement, row)
    conn.commit()

    #tag
    file = open("initial_data/tag.csv")
    csvreader = csv.reader(file)
    for row in csvreader:
        statement = "INSERT INTO tag (Tag_id, userUser_id) VALUES (%s, %s)"
        cur.execute(statement, row)
        conn.commit()
    file.close()

    #tag_vehicle
    file = open("initial_data/tag_vehicle.csv")
    csvreader = csv.reader(file)
    for row in csvreader:
        statement = "INSERT INTO tag_vehicle (tagTag_id, vehicleVehicle_ref) VALUES (%s, %s)"
        cur.execute(statement, row)
        conn.commit()
    file.close()


    #cur.execute("SELECT * FROM Pass WHERE stationStation_id = %s", (s_id,))
    conn.close()

main()
