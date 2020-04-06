import { Rule, SchematicContext, Tree, url, apply, move, mergeWith, MergeStrategy, template, filter, SchematicsException, chain } from '@angular-devkit/schematics';
import { normalize, strings, experimental } from '@angular-devkit/core';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
// AST => abstract syntax tree
export function orderWizard(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const folderPath = normalize(strings.dasherize(_options.path + '/' + _options.name));
    const workspace = getWorkspace(_options, tree);
    let files = url('./files');

    const newTree = apply(files, [
      move(folderPath),
      template({
        ...strings,
        ..._options
      }),
      specFilter(_options)
    ]);

    const templateRule = mergeWith(newTree, MergeStrategy.Default);
    const updateModuleRule = updateRootModule(_options, workspace);
    const chainedRule = chain([templateRule, updateModuleRule]);
    return chainedRule(tree, _context);
  };
}

function specFilter(_options: any): Rule {
  if (_options.spec === 'false') {
    return filter(path => {
      return !path.match(/\.spec\.ts$/) && !path.match(/test\.ts$/);
    })
  }
  return filter(path => !path.match(/test\.ts$/));
}

function getWorkspace(_options: any, tree: Tree): experimental.workspace.WorkspaceSchema {
  const workspace = tree.read('./angular.json');

  if (!workspace) {
    throw new SchematicsException('angular.json file not forund');
  }

  return JSON.parse(workspace.toString());
}

function updateRootModule(_options: any, workspace: any): Rule {
  return (tree: Tree, _context: SchematicContext): Tree => {
    _options.project = (_options.project === 'defaultProject')
      ? workspace.defaultProject
      : _options.project;
    const project = workspace.projects[_options.project];
    const moduleName = strings.dasherize(_options.name);
    const exportedModuleName = strings.classify(_options.name);
    const modulePath = strings.dasherize(_options.path);

    const rootModulePath = `${project.root}/${project.sourceRoot}/${project.prefix}/${project.prefix}.module.ts`;
    const importContent = `import { ${exportedModuleName}Module } from './${modulePath}/${moduleName}/${moduleName}.module';\n`;

    const rec = tree.beginUpdate(rootModulePath);
    rec.insertLeft(0, importContent);
    tree.commitUpdate(rec);

    return tree
  }
}
