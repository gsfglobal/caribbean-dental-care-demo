set -e
cd /home/claude/video; mkdir -p seg
FONT=/usr/share/fonts/opentype/inter/Inter-SemiBold.otf
FONTB=/usr/share/fonts/opentype/inter/InterDisplay-Bold.otf
cap(){ # $1 text
 echo "drawbox=x=(iw-$2)/2:y=ih-150:w=$2:h=78:color=0x142b3b@0.9:t=fill,drawtext=fontfile=$FONT:text='$1':x=(w-text_w)/2:y=h-125:fontsize=32:fontcolor=white"
}
enc="-c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p -r 24"
ffmpeg -y -v error -loop 1 -framerate 24 -t 4 -i intro.png -vf "zoompan=z='1+0.0006*on':d=1:s=1920x1080:fps=24,fade=t=in:st=0:d=0.8" $enc seg/0.mp4
ffmpeg -y -v error -framerate 24 -i frames/s2_hero/%05d.jpg -vf "scale=1920:1080,$(cap 'Een warme eerste indruk, met een interactieve 3D-kies' 1000)" $enc seg/1.mp4
ffmpeg -y -v error -framerate 24 -i frames/s3_scroll/%05d.jpg -vf "scale=1920:1080,$(cap 'Alles wat een patiënt wil weten, op één pagina' 860)" $enc seg/2.mp4
ffmpeg -y -v error -framerate 24 -i frames/s4_treat/%05d.jpg -vf "scale=1920:1080,$(cap 'Elke behandeling helder uitgelegd' 620)" $enc seg/3.mp4
ffmpeg -y -v error -loop 1 -i bg.png -framerate 24 -i frames/s5_mobile/%05d.jpg -i mask.png -i bezel.png -filter_complex "\
[1:v]scale=416:900[ph];[ph][2:v]alphamerge[phm];[0:v][3:v]overlay=1166:76[b1];[b1][phm]overlay=1180:90:shortest=1,\
drawtext=fontfile=$FONT:text='MOBIEL':x=230:y=380:fontsize=22:fontcolor=0x3f7341,\
drawtext=fontfile=$FONTB:text='Gemaakt voor de telefoon.':x=230:y=420:fontsize=64:fontcolor=0x142b3b,\
drawtext=fontfile=$FONT:text='Bellen of WhatsApp met één tik,':x=230:y=520:fontsize=34:fontcolor=0x223744,\
drawtext=fontfile=$FONT:text='altijd binnen handbereik.':x=230:y=568:fontsize=34:fontcolor=0x223744" $enc seg/4.mp4
ffmpeg -y -v error -framerate 24 -i frames/s6_form/%05d.jpg -vf "scale=1920:1080,$(cap 'Een afspraak aanvragen in één minuut' 690)" $enc seg/5.mp4
ffmpeg -y -v error -framerate 24 -i frames/s7_admin/%05d.jpg -vf "scale=1920:1080,$(cap 'De aanvraag staat direct in de beheeromgeving van uw team' 1060)" $enc seg/6.mp4
ffmpeg -y -v error -loop 1 -framerate 24 -t 5.5 -i outro.png -vf "zoompan=z='1+0.0005*on':d=1:s=1920x1080:fps=24,fade=t=out:st=4.5:d=1" $enc seg/7.mp4
# crossfade chain
D=(); for i in 0 1 2 3 4 5 6 7; do D+=($(ffprobe -v error -show_entries format=duration -of csv=p=0 seg/$i.mp4)); done
F=0.5; filt=""; prev="[0:v]"; off=0
for i in 1 2 3 4 5 6 7; do off=$(python3 -c "print(round($off+${D[$((i-1))]}-$F,3))"); filt="$filt$prev[$i:v]xfade=transition=fade:duration=$F:offset=$off[v$i];"; prev="[v$i]"; done
ffmpeg -y -v error $(for i in 0 1 2 3 4 5 6 7; do echo -n "-i seg/$i.mp4 "; done) -filter_complex "${filt%;}" -map "[v7]" $enc video_noaudio.mp4
T=$(ffprobe -v error -show_entries format=duration -of csv=p=0 video_noaudio.mp4)
ffmpeg -y -v error -i video_noaudio.mp4 -i music.wav -filter_complex "[1:a]atrim=0:$T,afade=t=out:st=$(python3 -c "print($T-3)"):d=3,loudnorm=I=-16:TP=-1.5:LRA=11[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -shortest out.mp4
echo "durata $T"
