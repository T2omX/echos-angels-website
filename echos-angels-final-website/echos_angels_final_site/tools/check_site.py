import json, os
issues=[]
warnings=[]
with open('content.json','r',encoding='utf-8') as f:
    data=json.load(f)
required=['index.html','content.json','assets/css/styles.css','assets/js/site.js','404.html','robots.txt','sitemap.xml']
for path in required:
    if not os.path.exists(path): issues.append(f'Missing required file: {path}')
site=data.get('site',{})
if not site.get('businessName'): issues.append('Missing business name')
if not site.get('email'): issues.append('Missing public email')
elif '@' not in site.get('email',''): issues.append('Email does not look valid')
if not site.get('serviceArea'): warnings.append('Service area is blank')
if not site.get('phone'): warnings.append('Phone is blank; okay if intentional')
for collection in ['services','gallery','faq']:
    if not [x for x in data.get(collection,[]) if x.get('enabled',True)]: issues.append(f'No enabled {collection} items')
paths=[]
imgs=data.get('images',{})
for key in ['logo','pixelEcho','aboutImage']:
    if imgs.get(key): paths.append(imgs[key])
paths += imgs.get('heroSlides',[])
for item in data.get('services',[]):
    if item.get('image'): paths.append(item['image'])
for item in data.get('gallery',[]):
    if item.get('src'): paths.append(item['src'])
for p in paths:
    if p and not (p.startswith('http://') or p.startswith('https://')) and not os.path.exists(p):
        warnings.append(f'Missing local image: {p}')
print("Echo's Angels launch check")
print('===========================')
if not issues and not warnings:
    print('No major issues found.')
else:
    if issues:
        print('\nFIX BEFORE LAUNCH:')
        for i in issues: print('- '+i)
    if warnings:
        print('\nWARNINGS / OPTIONAL:')
        for w in warnings: print('- '+w)
