import os
import glob
import os

pwd = str(os.getcwd())
print pwd

def crop(name):
    os.system('convert %s/script/photo/%s -crop 1360x2830+300+580 +repage %s/source/images/%s' % (pwd, name, pwd, name))

for file in glob.glob(str(pwd) + "/script/photo/*"):
    # file: /Users/amedeospagnolo/DATA/GIT/TINKLABS/flow_android/script/photo/image.jpeg
    # photo: image.jpeg
    temp = file.split('/')
    photo = temp[len(temp) - 1]
    print('cropping %s' % (photo))
    crop(photo)
