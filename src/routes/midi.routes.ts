import express from 'express'
import midiCtrl from "../controllers/midi.controller"
const router = express.Router()

router.route("/midis/save")
    .post(midiCtrl.addNew)

export default router