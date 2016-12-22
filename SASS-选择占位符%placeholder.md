# SASS之 选择占位符%placeholder  
## Placeholder Selectors: %foo
Sass supports a special type of selector called a "placeholder selector". These look like class and id selectors, except the # or . is replaced by %. They're meant to be used with the @extend directive; for more information see @extend-Only Selectors.

On their own, without any use of @extend, rulesets that use placeholder selectors will not be rendered to CSS.
