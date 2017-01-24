import os
import glob
import os

pwd = str(os.getcwd())
print pwd

crp1 = '1715x3300+1320+300'
crp2 = '1350x2430+1460+710'

def crop(name):
    os.system('convert %s/script/photo/%s -crop %s +repage -resize 400x %s/source/images/%s' % (pwd, name, crp2, pwd, name))

for file in glob.glob(str(pwd) + "/script/photo/*.JPG"):
    # file: /Users/amedeospagnolo/DATA/GIT/TINKLABS/flow_android/script/photo/image.jpeg
    # photo: image.jpeg
    temp = file.split('/')
    photo = temp[len(temp) - 1]
    print('cropping %s' % (photo))
    crop(photo)
