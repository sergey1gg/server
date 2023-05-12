const {Schema,model}=require('mongoose')

const Directory = new Schema({
   rooms: {
    type: [String],
    default: ["спальня","кухня","туалет","ванная","гардероб"]
   },
   elements: {
    type: [String],
    default: ["потолок","входная дверь","пол"]
   },
   otdelka: {
    type: [String],
    default: ["паркет","ламинат","обои"]
   },
   defects: {
    type: [String],
    default: ["повреждение профиля","повреждение рамы"]
   },
   subdefects: {
    type: [String],
    default: ["скол","пробит","прожжен"]
   },
   comments: {
      type: [String],
      default: ["Внутренний откос имеет механические дефекты (СП 71.13330.2017 п. 7.2.13)","Визуальный осмотр всех оконных ручек. Повреждения любого характера не допускаются"]
     },
})

module.exports =model('Directory', Directory)
