library(ggplot2)
library(ggpattern)
# library(magick)
# library(magrittr)

for (i in magick_pattern_names) {
  
  p <- ggplot() +
    geom_tile_pattern(
      aes(x = 1, y = 1),
      pattern_type = i,
      pattern       = 'magick',
      pattern_scale = 1,
      pattern_fill  = 'white'
    ) + 
    theme_void()
  
  ggsave(paste0(i, ".png"), p, width = 40, height = 30, units = "px")
  
  # image_read(paste0(i, "_lg.png")) %>%
  #   image_scale("28x28") %>%
  #   image_write(paste0(i, "_sm.png"), "png")
  
}

