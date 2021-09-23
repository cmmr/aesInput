
aesInputDemo <- function() {
  
  shinyApp(
    
    ui = sidebarLayout(
      sidebarPanel(
        aesInput("color",   "Color Picker",   ggplot2::diamonds, picker = "color"),
        aesInput("shape",   "Shape Picker",   ggplot2::diamonds, picker = "shape"),
        aesInput("pattern", "Pattern Picker", ggplot2::diamonds, picker = "pattern"),
        aesInput("basic",   "Basic Picker",   ggplot2::diamonds, picker = "basic"),
        aesInput("multi",   "Multi Picker",   ggplot2::diamonds, picker = "multi")
      ),
      mainPanel(
        plotOutput("plot"),
        verbatimTextOutput("color.json"),
        verbatimTextOutput("shape.json"),
        verbatimTextOutput("pattern.json"),
        verbatimTextOutput("basic.json"),
        verbatimTextOutput("multi.json")
      )
    ), 
    
    server = function(input, output, session) {
      # output[['plot']] <- renderPlot({
      # 
      #   ai <- ai.flatten(
      #     input[['color']],
      #     input[['shape']],
      #     input[['pattern']],
      #     input[['basic']],
      #     input[['multi']]
      #   )
      # 
      #   browser()
      # 
      #   data    <- ai.subset(ggplot2::diamonds, ai)
      #   mapping <- ai.aes(ai, x = 'carat', y = 'price')
      # 
      #   ggplot(data, mapping) + ai.scales(ai)
      # })
      
      output[['color.json']]   <- renderText({as.character(input[['color']])})
      output[['shape.json']]   <- renderText({as.character(input[['shape']])})
      output[['pattern.json']] <- renderText({as.character(input[['pattern']])})
      output[['basic.json']]   <- renderText({as.character(input[['basic']])})
      output[['multi.json']]   <- renderText({as.character(input[['multi']])})
      
      session$onSessionEnded(stopApp)
    }
  )
}
