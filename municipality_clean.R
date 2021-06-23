# Author: Charmaine Runes
# Project: Cicero x SSW Collaboration

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

demographics <- read_csv(here("data", "cmap-municipality-cds.csv")) 
demographics.clean <- demographics %>% 
  rename(city = GEOG)

all_municipalities.clean <- all_municipalities %>% 
  separate(week_start, c("month", "day", "year"), sep="/") %>% 
  mutate(month = str_pad(month, width=2, pad="0"),
         day = str_pad(day, width=2, pad="0"),
         year = paste("20", as.character(year), sep=""),
         date = as.Date(str_c(year, month, day, sep="-"), "%Y-%m-%d"),
         pct_complete_vax = as.numeric(percent_with_complete_vaccine_series)/100,
         pct_first_vax = as.numeric(percent_with_at_least_one_vaccine_dose)/100) %>% 
  filter(date >= as.Date("2021-01-01", "%Y-%m-%d"),
         pct_complete_vax <= 1,
         pct_first_vax <= 1)

cities <- c("Blue Island", "Calumet City", "Cicero", "Dolton", "Harvey", "Maywood", "Berwyn", "Stickney")
highlighted <- all_municipalities.clean %>% 
  filter(city %in% cities)

# Complete vaccine series - all
ggplot(data=all_municipalities.clean, 
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
ggplot(data=all_municipalities.clean, 
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
most_recent <- all_municipalities.clean %>% 
  filter(date == max(date))
write.csv(most_recent, './data/most_recent.csv', row.names = FALSE)

# Get time-series data
vax_rates <- all_municipalities.clean %>% 
  select(date, city, pct_complete_vax)

write.csv(vax_rates, './data/vax_rates.csv', row.names = FALSE)
  
# Merge most_recent and demographics
recent_demog <- merge(most_recent, demographics.clean, by="city")
ggplot(data=recent_demog, 
       aes(MEDINC, pct_complete_vax)) +
  geom_point(alpha=0.7) +
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
