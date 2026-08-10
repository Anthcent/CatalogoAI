type ExportItem = { publicCode:string; title:string; description:string; blocks:{type:string;content:unknown}[] };

export function toMarkdown(item: ExportItem) {
  const sections=item.blocks.map(block=>{const content=block.content as {text?:string,url?:string};const text=content.text??content.url??"";if(block.type==="heading")return `## ${text}`;if(block.type==="code")return `\`\`\`\n${text}\n\`\`\``;if(block.type==="callout")return `> ${text}`;return text;});
  return `# ${item.title}\n\n**Code:** ${item.publicCode}\n\n${item.description}\n\n${sections.join("\n\n")}\n`;
}
