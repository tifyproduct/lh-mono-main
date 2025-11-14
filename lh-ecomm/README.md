# LuxeHouze
LuxeHouze is a luxury e-commerce, in this project will accommodate the project itself, so-called "Headless" project due to the backend will be relying on Shopify, and this repository will only manage Frontend by this time

## Installation
1. Cloned the project 
2. Make sure you have [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) preinstalled to you local machine
3. Install the project dependency
```
yarn install
```

## Usage
1. You will be needing `.env` ,so please ask the project owner for the value
2. Remove `.example` from your `.env.example` and paste the value to the key respectively
3. Run the project using 
```
yarn dev
```

## Contributing

### Branching Name Format

**`LH/[Task_Category]/[Task_Epic]_[Task_Name]`**


### Pull Request Title Format


**`[Task_Category]: [Task_Epic]_[Task_Name]`**

**Explanation:**

1. **Task Category** 

   This is mostly used by developers (but this could be added for other functions based on the needs). There will be several categories that come to mind so far, such as:
   - feat (new feature)
   - fix (fix bug)
   - chore (mostly not feature-related, but it's the foundation setup we need)
   - test (for test case)
2. **Task Epic** 
   
   This is optional. If you have a bigger task and need to be separated into smaller but still in one group, we can use this identifier to see which ticket is still in one group, even from the separated ticket
3. **Task Name** 
 
    This is the task's name that describes what we are doing.

**Notes:**

*For task epic and task name could be merged and simplified if it is too long but still describe the whole epic and task*

**Example**:
1. Branch Name
   - LH/chore/setup_foundation_add_color
   - LH/chore/setup_foundation_color
2. Pull Request Title
   - chore: add color for ds foundation 
   - chore: setup ds foundation for color

## Folder Structure
```
├── lib
	├── components
	    Contains global re-usable components
	    ├── {component}
		    Each component has their own folder
		    ├── index.svelte
		    ├── types.ts
    ├── pages
	    Contains page components
	    ├── {page}
		    Each page has their own folder
		    ├── index.svelte
	├── utils
	    Reusable helper functions
└── routes
	Routing
```

## License
LuxeHouze