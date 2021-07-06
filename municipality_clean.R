# Author: Charmaine Runes
# Project: Cicero x SSW Collaboration
# Updated: June 29, 2021

library(tidyverse)
library(tidyr)
library(dplyr)
library(readr)
library(ggplot2)
library(scales)
library(stringr)
library(here)
library(zoo)
library(ggtext)
library(viridis)
library(directlabels)

all_municipalities <- read_csv(here("data","covid_municipality_weekly.csv"),
                     col_types = cols(.default = "c"))

may_june <- read_csv(here("data","updated_ccdph_data - may_june.csv"),
                     col_types = cols(.default = "c"))

demographics <- read_csv(here("data", "censusdata_1418.csv")) 
demographics.clean <- demographics %>% 
  rename(city = GEOG) %>% 
  mutate(pct_white = WHITE / TOT_POP)

all_municipalities.clean <- all_municipalities %>% 
  separate(week_start, c("month", "day", "year"), sep="/") %>% 
  mutate(month = str_pad(month, width=2, pad="0"),
         day = str_pad(day, width=2, pad="0"),
         year = paste("20", as.character(year), sep=""),
         date = as.Date(str_c(year, month, day, sep="-"), "%Y-%m-%d"),
         pct_complete_vax = as.numeric(percent_with_complete_vaccine_series)/100,
         pct_first_vax = as.numeric(percent_with_at_least_one_vaccine_dose)/100) %>% 
  filter(date >= as.Date("2021-01-01", "%Y-%m-%d"),
         date <= as.Date("2021-05-01", "%Y-%m-%d"),
         as.numeric(pct_complete_vax) <= 1)

may_june.clean <- may_june %>% 
  separate(week_start, c("month", "day", "year"), sep="/") %>% 
  mutate(month = str_pad(month, width=2, pad="0"),
         day = str_pad(day, width=2, pad="0"),
         date = as.Date(str_c(year, month, day, sep="-"), "%Y-%m-%d"),
         pct_complete_vax = as.numeric(percent_with_complete_vaccine_series)/100,
         pct_first_vax = as.numeric(percent_with_at_least_one_vaccine_dose)/100)
  filter(date > as.Date("2021-05-01", "%Y-%m-%d")) 
  
updated_data <- rbind(all_municipalities.clean, may_june.clean) %>% 
  filter(as.numeric(pct_complete_vax) <= 1)

cities <- c("Blue Island", "Calumet City", "Cicero", "Dolton", "Harvey", "Maywood", "Berwyn", "Stickney")
highlighted <- updated_data %>% 
  filter(city %in% cities)

# Complete vaccine series - all
ggplot(data=updated_data, 
       aes(date, pct_complete_vax, group=city)) +
  geom_line(color="lightgrey", alpha=0.5) +
  geom_line(data=highlighted, color="#d01c8b", alpha=0.7) +
  xlab("Date") + ylab("Percent of pop. received complete vaccine series") +
  scale_y_continuous(labels = scales::label_percent(accuracy=1), breaks=seq(0, 1, 0.1)) +
  theme(
    axis.ticks = element_blank(),
    panel.grid.major.y = element_line(size=0.5, linetype="dotted", colour ="lightgrey"),
    panel.grid.major.x = element_blank(),
    panel.grid.minor = element_blank(),
    panel.border = element_blank(),
    panel.background = element_rect(fill = "white", colour = "white"))

ggplot(data=updated_data %>% filter(city == "Harvey"), 
       aes(date, pct_complete_vax)) +
  geom_line(color="#d01c8b") +
  xlab("Date") + ylab("Percent of pop. received complete vaccine series") +
  scale_y_continuous(labels = scales::label_percent(accuracy=1), breaks=seq(0, 0.25, 0.05)) +
  theme(
    axis.ticks = element_blank(),
    panel.grid.major.y = element_line(size=0.5, linetype="dotted", colour ="lightgrey"),
    panel.grid.major.x = element_blank(),
    panel.grid.minor = element_blank(),
    panel.border = element_blank(),
    panel.background = element_rect(fill = "white", colour = "white"))

# Complete vaccine series - focus
ggplot(data=highlighted, 
       aes(date, pct_complete_vax, group=city)) +
  geom_line(aes(color=city), alpha=0.5) +
  xlab("Date") + ylab("Percent of pop. received complete vaccine series") +
  scale_y_continuous(labels = scales::label_percent(accuracy=1), breaks=seq(0, 1, 0.1)) +
  theme(
    axis.ticks = element_blank(),
    panel.grid.major.y = element_line(size=0.5, linetype="dotted", colour ="lightgrey"),
    panel.grid.major.x = element_blank(),
    panel.grid.minor = element_blank(),
    panel.border = element_blank(),
    panel.background = element_rect(fill = "white", colour = "white"))

# First dose
ggplot(data=updated_data, 
       aes(date, pct_first_vax, group=city)) +
  geom_line(color="lightgrey", alpha=0.5) +
  geom_line(data=highlighted, color="#d01c8b", alpha=0.7) +
  xlab("Date") + ylab("Percent of pop. received at least first vaccine") +
  scale_y_continuous(labels = scales::label_percent(accuracy=1), breaks=seq(0, 1, 0.1)) +
  theme(
    axis.ticks = element_blank(),
    panel.grid.major.y = element_line(size=0.5, linetype="dotted", colour ="lightgrey"),
    panel.grid.major.x = element_blank(),
    panel.grid.minor = element_blank(),
    panel.border = element_blank(),
    panel.background = element_rect(fill = "white", colour = "white"))

# Get most recent data
most_recent <- updated_data %>% 
  filter(date == max(date))
write.csv(most_recent, './data/most_recent.csv', row.names = FALSE)

# Get time-series data
vax_rates <- updated_data %>% 
  select(date, city, pct_complete_vax)

write.csv(vax_rates, './data/vax_rates.csv', row.names = FALSE)
  
# Merge most_recent and demographics
recent_demog <- merge(most_recent, demographics.clean, by="city")
write.csv(recent_demog, './data/recent_demog.csv', row.names = FALSE)

ggplot(data=recent_demog, 
       aes(MEDINC, pct_complete_vax)) +
  geom_point(alpha=0.7) +
  geom_smooth() +
  xlab("Median household income") + ylab("Percent received complete vaccine series") +
  scale_y_continuous(labels = scales::label_percent(accuracy=1), breaks=seq(0, 1, 0.1)) +
  scale_x_continuous(labels = scales::label_dollar(accuracy=1)) +
  theme(
    axis.ticks = element_blank(),
    panel.grid.major.y = element_line(size=0.5, linetype="dotted", colour ="lightgrey"),
    panel.grid.major.x = element_blank(),
    panel.grid.minor = element_blank(),
    panel.border = element_blank(),
    panel.background = element_rect(fill = "white", colour = "white"))

sswFocus <- c("Blue Island", "Calumet City", "Harvey", "Dolton")
ciceroFocus <- c("Berwyn", "Cicero", "Maywood", "Stickney")

sswCities <- recent_demog %>% 
  filter(city %in% sswFocus)

ciceroCities <- recent_demog %>% 
  filter(city %in% ciceroFocus)

ggplot(data=recent_demog, 
       aes(pct_white, pct_complete_vax)) +
  geom_point(alpha=0.7) +
  geom_point() +
  xlab("Percent white") + ylab("Percent received complete vaccine series") +
  scale_y_continuous(labels = scales::label_percent(accuracy=1), breaks=seq(0, 1, 0.1)) +
  scale_x_continuous(labels = scales::label_percent(accuracy=1), breaks=seq(0,1,0.1)) +
  theme(
    axis.ticks = element_blank(),
    panel.grid.major.y = element_line(size=0.5, linetype="dotted", colour ="lightgrey"),
    panel.grid.major.x = element_blank(),
    panel.grid.minor = element_blank(),
    panel.border = element_blank(),
    panel.background = element_rect(fill = "white", colour = "white"))

# Look at highlighted and most recent
highlighted_recent <- most_recent %>% 
  filter(city %in% cities)

# Load CARES Act funding data
funding <- read_csv(here("data","municipal-funding-total-allocation.csv"),
         col_types = cols(.default = "c"))

funding.clean <- funding %>% 
  mutate(city = municipality) %>% 
  select(-municipality)

funding_vax <- merge(funding.clean, most_recent, by="city") %>% 
  mutate(final_allocation = as.numeric(gsub('\\$|,', '', final_allocation)))
  
# CARES Act funding vs. pct vaccinated
ggplot(data=funding_vax, 
       aes(final_allocation, pct_complete_vax)) +
  geom_point(alpha=0.7) +
  xlab("CARES Act allocation") + ylab("Percent received complete vaccine series") +
  scale_y_continuous(labels = scales::label_percent(accuracy=1), breaks=seq(0, 1, 0.1)) +
  scale_x_continuous(labels = scales::label_dollar(accuracy=1)) +
  theme(
    axis.ticks = element_blank(),
    panel.grid.major.y = element_line(size=0.5, linetype="dotted", colour ="lightgrey"),
    panel.grid.major.x = element_blank(),
    panel.grid.minor = element_blank(),
    panel.border = element_blank(),
    panel.background = element_rect(fill = "white", colour = "white"))

# Compare average of other counties to highlighted
towns_demog <- merge(updated_data, demographics.clean, by="city") %>% 
  mutate(manual_vaxpct = as.numeric(total_with_complete_vaccine_series) * 100 / as.numeric(TOT_POP))

highlighted_demog <- towns_demog %>% 
  filter(city %in% cities) %>% 
  #filter(city %in% c("Blue Island", "Calumet City", "Harvey", "Dolton")) %>% 
  group_by(date) %>% 
  summarise(avg_pct = sum(as.numeric(total_with_complete_vaccine_series)) / sum(TOT_POP))

`%notin%` <- Negate(`%in%`)
other_demog <- towns_demog %>% 
  filter(city %notin% cities) %>% 
  #filter(city %notin% c("Blue Island", "Calumet City", "Harvey", "Dolton")) %>% 
  group_by(date) %>% 
  summarise(avg_pct = sum(as.numeric(total_with_complete_vaccine_series)) / sum(TOT_POP))

all_pct <- towns_demog %>% 
  group_by(date) %>% 
  summarise(avg_pct = sum(as.numeric(total_with_complete_vaccine_series)) / sum(TOT_POP))

# Check visually (highlighted vs non) - maybe bar chart?
ggplot(data=other_demog, aes(date, as.numeric(avg_pct))) +
  geom_line(color="black", alpha=0.5) +
  geom_line(data=highlighted_demog, color="#d01c8b") +
  geom_line(data=all_pct, color="green") +
  xlab("Date") + ylab("Percent of pop. received complete vaccine") +
  scale_y_continuous(labels = scales::label_percent(accuracy=1), breaks=seq(0, 1, 0.1)) +
  theme(
    axis.ticks = element_blank(),
    panel.grid.major.y = element_line(size=0.5, linetype="dotted", colour ="lightgrey"),
    panel.grid.major.x = element_blank(),
    panel.grid.minor = element_blank(),
    panel.border = element_blank(),
    panel.background = element_rect(fill = "white", colour = "white"))   

# Look just at the gap
diff_vax <- other_demog %>% 
  rename(avg_pct_other = avg_pct) %>% 
  cbind(highlighted_demog %>% select(-date)) %>% 
  rename(avg_pct_highlighted = avg_pct) %>% 
  mutate(diff = avg_pct_other - avg_pct_highlighted) 

diff_vax_js <- other_demog %>% 
  mutate(group = "Other") %>% 
  rbind(highlighted_demog %>% mutate(group = "Highlighted"))

write.csv(diff_vax_js, './data/diff_vax.csv', row.names = FALSE)

# Check visually (highlighted vs non)
ggplot(data=diff_vax, aes(date, diff)) +
  geom_line(color="black", alpha=0.5) +
  xlab("Date") + ylab("Percent of pop. received complete vaccine") +
  scale_y_continuous(labels = scales::label_percent(accuracy=1), breaks=seq(0, .1, 0.01)) +
  theme(
    axis.ticks = element_blank(),
    panel.grid.major.y = element_line(size=0.5, linetype="dotted", colour ="lightgrey"),
    panel.grid.major.x = element_blank(),
    panel.grid.minor = element_blank(),
    panel.border = element_blank(),
    panel.background = element_rect(fill = "white", colour = "white"))   
