# CLI

Περιεχόμενα:

- Command line interface (CLI).
- Υποστηρίζονται οι εξής εντολές:
  se2157 healthcheck
  se2157 resetpasses
  se2157 resetstations
  se2157 resetvechiles
  se2157 passesperstation --op1 OP1 --op2 OP2 --datefrom DATATEFROM --dateto DATETO
  se2157 passesanalysis --op1 OP1 --op2 OP2 --datefrom DATATEFROM --dateto DATETO
  se2157 passescost --op1 OP1 --op2 OP2 --datefrom DATATEFROM --dateto DATETO
  se2157 chargesby --op1 OP1 --datefrom DATATEFROM --dateto DATETO
  se2157 admin --passesupd --source SOURCE.csv

  Για την τελευταία εντολή πρέπει να ακολουθείται η μορφή αρχείου κατά το πρότυπο του αρχείου sampledata01_passes100_8000.csv που υπάρχει στον φάκελο doc/sampledata01/. Επίσης το διαχωριστικό (seperator) του csv αρχείου πρέπει να είναι semi-colon (;)
