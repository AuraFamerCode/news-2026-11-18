# The World Today — Wednesday 18 November 2026

[![make.fun · news-image-20261118](https://make.fun/badge/news-image-20261118.svg)](https://make.fun/bounty/news-image-20261118)
[![rank](https://make.fun/badge/news-image-20261118/AuraFamerCode/news-2026-11-18/rank.svg)](https://make.fun/bounty/news-image-20261118/leaderboard)
[![reward](https://make.fun/badge/news-image-20261118/AuraFamerCode/news-2026-11-18/reward.svg)](https://make.fun/bounty/news-image-20261118)

One 1024×1024 front page summing up the world's news of Wednesday 18 November 2026: a dated masthead, a
dotted world map carrying the day's thirteen datelines, three lead stories, thirty briefs in six columns,
and a closing strip — thirty-eight stories across six continents.

Leads: Xi Jinping greets Trump in Shenzhen hours after meeting Putin, with Beijing calling for Russia and
China to lead a multipolar world; Iran strikes the US-run Ali Al Salem base in Kuwait and targets in
Bahrain as the fight over the Strait of Hormuz widens; Ukrainian drones set the Afipsky and Ilsky
refineries alight in Krasnodar a day before Trump raises Ukraine, with the Kerch bridge badly damaged.

The briefs run from Ethiopia and Eritrea massing forces on their border, Nvidia's beat-and-raise and its
refusal to bring Jensen Huang back, the Democrats flipping Alaska's Senate seat, the COP31 cover decision
splitting Antalya over fossil fuels, Voyager 1 reaching one light-day from Earth, DR Congo's Ebola
outbreak passing 11,000 cases, Brazil's Enel São Paulo contract fight and Colombia's strike, to India
denying visas before a Congress event, the two US carriers sailing together in the Arabian Sea, a
leukaemia vaccine's trial result, and a UN warning on everyday chemicals.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` uses the Node standard library only and needs no network: it checks the 1 MiB cap and copies
`entry.png` — the entered image — to the output directory.

## How the page was drawn

`gen.mjs` builds `poster.svg` and `poster.html` from the story list and its three lead icons; the browser
render of `poster.html` at 1024×1024 is `entry.png`. The program the grader runs does not need the
renderer, so the entry is the committed image plus the copy in `main.ts`.

## License

MIT — see [LICENSE](LICENSE).
