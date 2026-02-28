import sys

filepath = sys.argv[1] if len(sys.argv) > 1 else 'src/pages/page009/useVoiceSessionV2.ts'

with open(filepath, 'r') as f:
    c = f.read()

# Find the ALIASES block boundaries
start_marker = 'const ALIASES: Record<string, string[]> = {'
end_marker = '}\n\n\n// '

start_i = c.index(start_marker)
end_i = c.index(end_marker, start_i) + 1  # include the closing }

new_aliases = """const ALIASES: Record<string, string[]> = {
  // DX-1: Primary goal
  "Negotiate ATO Debt / Avoid insolvency": ["negotiate","keep trading","stay open","continue trading","keep operating","stay in business","keep going","save the business","avoid insolvency","negotiate debt","reduce debt","settle","pay less","lower the debt","avoid bankruptcy","not go bankrupt"],
  "Wind down responsibly": ["wind down","close responsibly","shut down","wind up","close business","orderly closure","wind it down","close it down","responsibly"],
  // DX-2: Business structure
  "Individual": ["individual","myself","personal","me","just me","im an individual","i am an individual","personal capacity"],
  "Sole Trader": ["sole trader","sole","soul trader","sole proprietor","self employed","self-employed","sole business","sole trade","im a sole trader"],
  "Partnership": ["partnership","partner","partners","business partner","business partners"],
  "Company": ["company","pty ltd","pty","proprietary","corporation","corp","limited company","my company"],
  "Trust": ["trust","family trust","unit trust","discretionary trust","trust structure"],
  // DX-3: Debt duration
  "Less than 12 months": ["less than 12","under 12","under a year","less than a year","recent","new debt","just started","few months","couple months","six months","under six months","9 months","about a year"],
  "1 \\u2013 2 years": ["1 to 2","one to two","about a year","year and a half","18 months","about two years","couple of years","a year or two"],
  "2 \\u2013 5 years": ["2 to 5","two to five","few years","several years","about three","three years","four years","about 3","about 4","a while"],
  "5+ years": ["5 plus","over 5","more than 5","over five","long time","ages","many years","long standing","been going on for years"],
  // DX-4: BAS returns
  "Unsure": ["unsure","not sure","don't know","uncertain","maybe","possibly","not certain","no idea","i'm not sure","what's that"],
  "Partially lodged": ["partial","partially","some lodged","partially lodged","some done","mixed","half done","some of them"],
  "Lodged and up to date": ["lodged","up to date","all current","yes all current","fully lodged","all done","completely current","all lodged","yes current","yeah all current"],
  "Never lodged": ["never","never lodged","not filed","none lodged","never done","haven't ever","never have","not done","not lodged"],
  // DX-5: Superannuation
  "Yes": ["yes","yep","yeah","there is","outstanding super","super owing","behind on super","owe super","yes there is"],
  "No": ["no","nope","nah","no super owing","super is current","all paid","super paid","no outstanding","negative"],
  // DX-6: Income tax returns (same option text as DX-4, aliases reused automatically)
  // DX-7: Payment plan
  "Never": ["never","no","nope","haven't","no payment plan","no i haven't","not attempted","never had","no plan","nah"],
  "In current payment plan": ["current plan","in a plan","currently paying","active plan","yes current","paying now","on a plan","have a plan"],
  "Yes but defaulted": ["defaulted","default","broke the plan","failed","couldn't keep up","fell behind","defaulted on it","yes but defaulted"],
  "Attempted but rejected": ["rejected","was rejected","they said no","denied","turned down","refused","they wouldn't accept","attempted but rejected"],
  // DX-8: Director/individual
  "Yes, I am": ["yes","yes i am","yep","correct","that's right","i am","yeah","that's me","yes director","i am the director","yes i'm the director"],
  "No, I'm not": ["no","no i'm not","nope","not a director","no i am not","nah","negative","i'm not","not me"],
  // DX-9: Monthly contribution
  "Yes, I can": ["yes","yes i can","yep","i can","definitely","of course","absolutely","yes i can contribute","i can pay","i can afford it"],
  "No, I can't": ["no","no i can't","nope","can't afford","nothing","zero","no capacity","i can't","not able","unable","negative"],
  "Potentially / Maybe": ["maybe","potentially","perhaps","possibly","depends","not sure","might be able","could possibly","it depends","uncertain"],
  // DX-10: Payment timeframe
  "Up to 1 year": ["up to a year","under a year","within a year","12 months","less than a year","short term","quickly","as fast as possible"],
  "1 \\u2013 2 years": ["1 to 2","one to two","about two years","year and a half","18 months","couple of years","a year or two"],
  "2 \\u2013 3 years": ["2 to 3","two to three","about three years","couple of years","thirty months","24 to 36","longer term"],
  // DX-11: Income trending
  "Growing": ["growing","growth","increasing","going up","expanding","improving","getting better","on the up","good"],
  "Stable": ["stable","steady","consistent","same","holding","flat","staying the same","not changing","neutral"],
  "Declining": ["declining","going down","decreasing","falling","worse","dropping","getting worse","struggling","less revenue"],
  // DX-12: Urgency
  "Not yet urgent / planning ahead": ["not urgent","planning ahead","early stages","just planning","proactive","being prepared","thinking ahead","preparation","not yet urgent"],
  "Moderate urgency": ["moderate","somewhat urgent","fairly urgent","getting urgent","reasonably urgent","kind of urgent","medium","in between","moderately"],
  "Very urgent": ["very urgent","urgent","really urgent","super urgent","extremely urgent","need help now","desperate","critical","time sensitive","asap","emergency","pressing"],
}"""

c = c[:start_i] + new_aliases + c[end_i+1:]

with open(filepath, 'w') as f:
    f.write(c)
print('ALIASES updated to 12Q')
