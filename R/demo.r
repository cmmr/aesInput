
aesInputDemo <- function() {
  
  library(shiny)
  library(ggplot2)
  
  shinyApp(
    
    ui = sidebarLayout(
      sidebarPanel(
        aesInput("color",   "Color Picker",   diamonds, picker = "color"),
        aesInput("shape",   "Shape Picker",   diamonds, picker = "shape"),
        aesInput("pattern", "Pattern Picker", diamonds, picker = "pattern"),
        aesInput("basic",   "Basic Picker",   diamonds, picker = "basic"),
        aesInput("multi",   "Multi Picker",   diamonds, picker = "multi")
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
      output[['plot']] <- renderPlot({
        
        ai <- ai.flatten(
          x <- input[['color']],
          y <- input[['shape']],
          input[['pattern']],
          input[['basic']],
          z <- input[['multi']]
        )

        # if (is.null(x) || is.null(y) || is.null(z))
        #   return (NULL)
        #
        # browser()

        data    <- ai.subset(ggplot2::diamonds, ai)
        mapping <- ai.aes(ai, x = 'carat', y = 'price')

        ggplot(data, mapping) + geom_point() + ai.scales(ai)
      })
      
      output[['color.json']]   <- renderText({ as.character(input[['color']])   })
      output[['shape.json']]   <- renderText({ as.character(input[['shape']])   })
      output[['pattern.json']] <- renderText({ as.character(input[['pattern']]) })
      output[['basic.json']]   <- renderText({ as.character(input[['basic']])   })
      output[['multi.json']]   <- renderText({ as.character(input[['multi']])   })
      
      session$onSessionEnded(stopApp)
    }
  )
}
