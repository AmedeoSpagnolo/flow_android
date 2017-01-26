import os
import glob
import os

pwd = str(os.getcwd())
print pwd

samsung_edge_phone = '1715x3300+1320+300'
samsung_edge_screen = '1350x2430+1460+710'

Asus_Zenfone_3_Deluxe_phone = '1050x2160+1672+386'
Asus_Zenfone_3_Deluxe_screen = '1011x1772+1679+544'

HTC_10_phone = '980,x2040+1960+580'
HTC_10_screen = '924,x1566+1990+780'

Huawei_Mate_9_phone = '1120x2220+978+311'
Huawei_Mate_9_screen = '1050x1820+1034+480'

LG_V20_phone = '1050x2220+1680+320'
LG_V20_screen = '1050x2000+1680+420'

Sony_Xperia_XZ_phone = '1000x2080+1840+490'
Sony_Xperia_XZ_screen = '920,x1550+1890+740'


def crop(name, phone, trim):
    os.system('convert %s/script/photo/%s/%s -crop %s +repage -resize 400x %s/source/images/%s/%s' % (pwd, phone, name, trim, pwd, phone, name))

def crop_folder(phone, trim):
    for file in glob.glob(str(pwd) + "/script/photo/" + str(phone) + "/*.JPG"):
        # file: /Users/amedeospagnolo/DATA/GIT/TINKLABS/flow_android/script/photo/image.jpeg
        # photo: image.jpeg
        temp = file.split('/')
        photo = temp[len(temp) - 1]
        print('cropping %s' % (photo))
        crop(photo, phone, trim)

# crop_folder('samsung_edge_screen', samsung_edge_screen)
# crop_folder('Asus_Zenfone_3_Deluxe_screen', Asus_Zenfone_3_Deluxe_screen)
crop_folder('HTC_10_screen', HTC_10_screen)
# crop_folder('Huawei_Mate_9_screen', Huawei_Mate_9_screen)
# crop_folder('LG_V20_screen', LG_V20_screen)
crop_folder('Sony_Xperia_XZ_screen', Sony_Xperia_XZ_screen)
