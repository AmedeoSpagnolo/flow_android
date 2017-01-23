import os
import glob
import os

def crop(name):
    os.system('convert photo/%s -crop 2830x1360+300+580 exports/%s' % (name, name))

for file in glob.glob("photo/*.jpeg"):
    photo = file.split('/', 1)[1]
    print('cropping %s' % (photo))
    crop(photo)
