#chart format

line1:artist

line2:title

line3:bpm

line4:offset

line5~end: chart content

tap:
time,notetype=0,positionx,positiony 
hold:
time,notetype=1,size=0~10
slide:
time,timestamp2,notetype=2,positionx,positiony 

time:
1 => 1/1 => 60000ms/bpm

e.g. when bpm=100 and offset=50, time=1.5 => 60000/100*1.5+50=950(ms)
