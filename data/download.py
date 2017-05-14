import requests









def get_and_write_file(desc):
    url = 'http://5.9.65.151/mschuetz/potree/resources/pointclouds/surface_and_edge/land_building/' + desc

    ref ='http://5.9.65.151/mschuetz/potree/resources/pointclouds/surface_and_edge/land_building/data/r/r2.bin'

    
    r = requests.get(url)
    print (ref)
    print(url)
    #print(r.content)
    with open(desc, "w") as f:
        f.write(r.text)


for n in range(22):
    get_and_write_file('data/r/r%s.bin' % n)
