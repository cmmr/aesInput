
# This function generates the client-side HTML for an aesInput

#' Creates an aesInput control on a Shiny UI.
#' 
#' @param inputId   The \code{input} slot that will be used to access the value.
#' @param label   Display label for the control, or \code{NULL} for no label.
#' @param data   The data.frame to use for populating the selectize dropdown.
#' @param allow  What types of column from \code{data} to use.
#'        Default: \code{c("factor", "numeric")}.
#' @param picker  \code{"basic"} (default), \code{"multi"}, \code{"color"},
#'        \code{"shape"}, or \code{"pattern"}.
#' @param vs   If \code{TRUE}, then instead of showing the values in the column,
#'        combinations of values will be displayed instead.
#' @return A list of aesInput values.
#' @family aesInput
#' @export
#'
aesInput <- function(inputId, label, data, allow=c("factor", "numeric"), picker="basic", vs=FALSE) {
  
  stopifnot(length(picker) == 1)
  stopifnot(picker %in% c("basic", "multi", "color", "shape", "pattern"))
  multiple <- ifelse(picker == "multi", "multiple", "")
  
  if (picker == "shape" && system.file(package = "ggpattern") == "")
    stop(
      "This option requires the 'ggpattern' package.\n", 
      "remotes::install_github('coolbutuseless/ggpattern')" )
  
  md <- data
  md <- md[,sapply(seq_len(ncol(md)), function (x) any(class(md[[x]]) %in% allow) ), drop=FALSE]
  
  json <- lapply(names(md), function (x) {
    
    if (is(md[[x]], "numeric") || is(md[[x]], "Date"))
      return (list( mode = "numeric",
                    name  = x,
                    min   = min(md[[x]], na.rm=TRUE),
                    max   = max(md[[x]], na.rm=TRUE) ))
    
    
    if (is(md[[x]], "factor")) {
      
      if (isTRUE(vs)) {
        within  <- levels(md[[x]])
        between <- apply(combn(within, 2), 2L, paste, collapse=" vs ")
        all     <- sort(c(within, between))
        
        return (list(mode = "factor", name = x, options = all))
        
      } else {
        return (list(mode = "factor", name = x, options = levels(md[[x]])))
      }
      
    }
    
  })
  
  
  link <- function (x) 
    htmltools::singleton(
      htmltools::tags$head(
        htmltools::tags$link(href = x, rel="stylesheet")))
  
  script <- function (x)
    htmltools::singleton(
      htmltools::tags$head(
        htmltools::tags$script(src = x)))
  
  htmltools::tagList(
    link("shared/bootstrap/css/bootstrap.min.css"),
    script("shared/bootstrap/js/bootstrap.min.js"),
    link("shared/ionrangeslider/css/ion.rangeSlider.css"),
    script("shared/ionrangeslider/js/ion.rangeSlider.min.js"),
    script("shared/strftime/strftime-min.js"),
    link("shared/selectize/css/selectize.bootstrap3.css"),
    script("shared/selectize/js/selectize.min.js"),
    script("shared/selectize/accessibility/js/selectize-plugin-a11y.min.js"),
    script("aesinput/js/initAesInput.js"),
    script("aesinput/js/binding.js"),
    script("aesinput/js/pickers.js"),
    
    htmltools::HTML(glue::glue(
      '
        <div id="{inputId}" class="control-group aesinput" data-picker="{picker}">
          <label for="{inputId}-parent">{label}</label>
          <select id="{inputId}-parent" class="form-control aesinput-parent"></select>
        </div>
        
        <script type="text/javascript">
          initAesInput("{inputId}", {shiny:::toJSON(json)}, "{picker}");
        </script>
      '
    ))
  )
}
