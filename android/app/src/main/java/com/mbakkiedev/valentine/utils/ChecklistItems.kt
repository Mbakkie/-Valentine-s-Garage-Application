package com.mbakkiedev.valentine.utils

import com.mbakkiedev.valentine.data.model.ServiceTask

object ChecklistItems {
    val CATEGORIES = mapOf(
        "ENGINE" to "Engine & Drivetrain",
        "FLUID" to "Fluids & Filters",
        "BRAKES" to "Brakes & Tyres",
        "ELECTRICAL" to "Electrical & Lights",
        "BODY" to "Body & Safety",
        "FINAL" to "Final Inspection"
    )

    val DEFAULT_CHECKLIST = listOf(
        ServiceTask(taskId = "eng_01", category = CATEGORIES["ENGINE"]!!, task = "Inspect engine oil level and condition", critical = true),
        ServiceTask(taskId = "eng_02", category = CATEGORIES["ENGINE"]!!, task = "Check coolant level and hoses", critical = true),
        ServiceTask(taskId = "eng_03", category = CATEGORIES["ENGINE"]!!, task = "Inspect drive belts for wear or cracking", critical = false),
        ServiceTask(taskId = "eng_04", category = CATEGORIES["ENGINE"]!!, task = "Check gearbox and differential oils", critical = false),
        ServiceTask(taskId = "eng_05", category = CATEGORIES["ENGINE"]!!, task = "Test engine start and idle", critical = true),
        
        ServiceTask(taskId = "flu_01", category = CATEGORIES["FLUID"]!!, task = "Replace engine oil and filter", critical = true),
        ServiceTask(taskId = "flu_02", category = CATEGORIES["FLUID"]!!, task = "Replace fuel filter", critical = false),
        ServiceTask(taskId = "flu_03", category = CATEGORIES["FLUID"]!!, task = "Inspect and top up brake fluid", critical = true),
        ServiceTask(taskId = "flu_04", category = CATEGORIES["FLUID"]!!, task = "Check power steering fluid level", critical = false),
        ServiceTask(taskId = "flu_05", category = CATEGORIES["FLUID"]!!, task = "Replace air filter if required", critical = false),
        
        ServiceTask(taskId = "brk_01", category = CATEGORIES["BRAKES"]!!, task = "Inspect front brake pads and discs", critical = true),
        ServiceTask(taskId = "brk_02", category = CATEGORIES["BRAKES"]!!, task = "Inspect rear brake pads / drums and linings", critical = true),
        ServiceTask(taskId = "brk_03", category = CATEGORIES["BRAKES"]!!, task = "Check handbrake operation and adjustment", critical = true),
        ServiceTask(taskId = "brk_04", category = CATEGORIES["BRAKES"]!!, task = "Inspect tyre tread depth on all wheels", critical = true),
        ServiceTask(taskId = "brk_05", category = CATEGORIES["BRAKES"]!!, task = "Check and adjust tyre pressure", critical = false),
        ServiceTask(taskId = "brk_06", category = CATEGORIES["BRAKES"]!!, task = "Inspect wheel nuts and studs", critical = false),
        
        ServiceTask(taskId = "elc_01", category = CATEGORIES["ELECTRICAL"]!!, task = "Test all exterior lights (head, tail, indicators)", critical = true),
        ServiceTask(taskId = "elc_02", category = CATEGORIES["ELECTRICAL"]!!, task = "Check battery voltage and terminals", critical = false),
        ServiceTask(taskId = "elc_03", category = CATEGORIES["ELECTRICAL"]!!, task = "Test horn functionality", critical = false),
        ServiceTask(taskId = "elc_04", category = CATEGORIES["ELECTRICAL"]!!, task = "Inspect wiper blades and washer fluid", critical = false),
        
        ServiceTask(taskId = "bdy_01", category = CATEGORIES["BODY"]!!, task = "Inspect cab and cargo body for damage", critical = false),
        ServiceTask(taskId = "bdy_02", category = CATEGORIES["BODY"]!!, task = "Check door locks, hinges and seals", critical = false),
        ServiceTask(taskId = "bdy_03", category = CATEGORIES["BODY"]!!, task = "Verify fire extinguisher present and charged", critical = true),
        ServiceTask(taskId = "bdy_04", category = CATEGORIES["BODY"]!!, task = "Check seat belts for wear and function", critical = true),
        
        ServiceTask(taskId = "fin_01", category = CATEGORIES["FINAL"]!!, task = "Road test — check braking, steering, and gears", critical = true),
        ServiceTask(taskId = "fin_02", category = CATEGORIES["FINAL"]!!, task = "Confirm no warning lights on dashboard", critical = true),
        ServiceTask(taskId = "fin_03", category = CATEGORIES["FINAL"]!!, task = "Clean vehicle interior", critical = false),
        ServiceTask(taskId = "fin_04", category = CATEGORIES["FINAL"]!!, task = "Document all repairs performed on job card", critical = true)
    )
}
