import os
import glob
import os

pwd = str(os.getcwd())
print pwd

def crop(name):
    os.system('convert %s/script/photo/%s -crop 1715x3300+1320+300 +repage -resize 400x %s/source/images/%s' % (pwd, name, pwd, name))

for file in glob.glob(str(pwd) + "/script/photo/*.JPG"):
    # file: /Users/amedeospagnolo/DATA/GIT/TINKLABS/flow_android/script/photo/image.jpeg
    # photo: image.jpeg
    temp = file.split('/')
    photo = temp[len(temp) - 1]
    print('cropping %s' % (photo))
    crop(photo)
