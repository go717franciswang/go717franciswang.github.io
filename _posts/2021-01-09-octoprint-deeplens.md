---
layout: post
title:  "OctoPrint on Deeplens"
date:   2021-01-09 15:47:00
categories: 
- 3d printing
---

I've been running OctoPi but don't have a camera to run Octolapse. Fortunately, I have an unused Amazon Deeplens as an alternative. Deeplens runs on Ubuntu 16, and is more powerful than a RaspberryPi. So, running OctoPrint is a matter of installing some packages. Whole process should take less than half an hour.

Here are steps to run OctoPrint on Amazon Deeplens.

If you don't have a power supply. Then purchase an 5V-4A power supply.

## References:

* Amazon Deeplens official setup [guide](https://docs.aws.amazon.com/deeplens/latest/dg/troubleshooting-device-registration.html#troubleshooting-device-wifi-connection).
* Tom Grek's [guide](https://medium.com/@tomgrek/hackers-guide-to-the-aws-deeplens-1b8281bc6e24) for establishing SSH connection.
* stibbons's [guide](https://community.octoprint.org/t/using-ffmpeg-for-webcam-streaming-and-timelapse-support/5321) to using ffmpeg.
* Official Octoprint installation [guide](https://octoprint.org/download/#installing-manually)

## Detailed Instructions:

### Set up OctoPrint on port 8080:

```
 root@Deepcam:/home/aws_cam# apt-add-repository universe
 root@Deepcam:/home/aws_cam# apt-get update
 root@Deepcam:/home/aws_cam# wget http://pyyaml.org/download/libyaml/yaml-0.2.5.tar.gz
 root@Deepcam:/home/aws_cam# tar xvfz yaml-0.2.5.tar.gz 
 root@Deepcam:/home/aws_cam/yaml-0.2.5# ./configure 
 root@Deepcam:/home/aws_cam/yaml-0.2.5# make
 root@Deepcam:/home/aws_cam/yaml-0.2.5# make install
 root@Deepcam:/home/aws_cam/OctoPrint# apt-get install software-properties-common
 root@Deepcam:/home/aws_cam/OctoPrint# add-apt-repository ppa:deadsnakes/ppa
 root@Deepcam:/home/aws_cam/OctoPrint# apt-get update
 root@Deepcam:/home/aws_cam# apt install python3.7
 root@Deepcam:/home/aws_cam# apt-get install python3.7-venv -y
 root@Deepcam:/home/aws_cam/OctoPrint# apt install python3.7-dev
 aws_cam@Deepcam:~$ mkdir OctoPrint && cd OctoPrint
 aws_cam@Deepcam:~/OctoPrint$ python3.7 -m venv venv
 aws_cam@Deepcam:~/OctoPrint$ source venv/bin/activate
 (venv) aws_cam@Deepcam:~/OctoPrint$ pip install pip --upgrade
 (venv) aws_cam@Deepcam:~/OctoPrint$ pip install octoprint
 (venv) aws_cam@Deepcam:~/OctoPrint$ sudo usermod -a -G tty aws_cam
 (venv) aws_cam@Deepcam:~/OctoPrint$ sudo usermod -a -G dialout aws_cam
 aws_cam@Deepcam:~$ sudo ufw allow 8080
 (venv) aws_cam@Deepcam:~/OctoPrint$ ~/OctoPrint/venv/bin/octoprint serve --port 8080
```

### Set up OctoPrint to auto start on boot

```
 aws_cam@Deepcam:~$ wget https://github.com/OctoPrint/OctoPrint/raw/master/scripts/octoprint.service && sudo mv octoprint.service /etc/systemd/system/octoprint.service
 aws_cam@Deepcam:~$ sudo vi /etc/systemd/system/octoprint.service
```
Add
```
 [Unit]
 Description=The snappy web interface for your 3D printer
 After=network-online.target
 Wants=network-online.target

 [Service]
 Environment="LC_ALL=C.UTF-8"
 Environment="LANG=C.UTF-8"
 Type=simple
 User=aws_cam
 ExecStart=/home/aws_cam/OctoPrint/venv/bin/octoprint --port 8080

 [Install]
 WantedBy=multi-user.target
```

Enable the service

```
 aws_cam@Deepcam:~$ sudo systemctl enable octoprint.service
 aws_cam@Deepcam:~$ sudo visudo  -f /etc/sudoers.d/octoprint-shutdown
```

Append

```
 aws_cam ALL=NOPASSWD: /sbin/shutdown
 aws_cam ALL=NOPASSWD: /usr/sbin/service
```

### Camera setup

```
 aws_cam@Deepcam:~$ sudo apt install ffmpeg
 aws_cam@Deepcam:~$ sudo ufw allow 8090
 # consult https://community.octoprint.org/t/using-ffmpeg-for-webcam-streaming-and-timelapse-support/5321 
 aws_cam@Deepcam:~$ sudo vi /etc/ffserver.conf
```

Append the following to stream camera feed to port 8090.
```
 <Stream camera.mjpeg>
 File "/opt/awscam/out/ch2_out.mjpeg"
 Format mpjpeg
 # Make sure frame rate and size
 # match those passed to ffmpeg
 VideoFrameRate 5
 VideoSize 640x480
 VideoGopSize 12
 VideoBitRate 4096
 VideoBufferSize 4096
 VideoQMin 5
 VideoQMax 51
 NoAudio
 Strict -1
 </Stream>

 <Stream camera.jpg>
 File "/opt/awscam/out/ch2_out.mjpeg"
 Format jpeg
 VideoFrameRate 2
 VideoIntraOnly
 VideoSize 640x480
 NoAudio
 NoDefaults
 Strict -1
 </Stream>
```

### OctoPrint camera setting

* stream URL: `//HOSTNAME:8090/camera.mjpeg`
* snapshot URL: `http://HOSTNAME:8090/camera.jpg`
* path to FFMPEG: `/usr/bin/ffmpeg`

### Configure FFSERVER to auto start on boot

```
 aws_cam@Deepcam:~$ sudo vi /etc/systemd/system/ffserver.service
```

Append

```
 [Unit]
 Description=FFMPEG streaming server service

 [Service]
 User=aws_cam
 ExecStart=/usr/bin/ffserver

 [Install]
 WantedBy=multi-user.target
```

Enable the service
```
 aws_cam@Deepcam:~$ sudo systemctl enable ffserver.service
```

## Win!

<iframe width="560" height="315" src="https://www.youtube.com/embed/uTwyQmIBTOE" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
