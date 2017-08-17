﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace MatchesComparator
{
	class Program
	{
		static void Main(string[] args)
		{
			MatchRepo repo = new MatchRepo();

			string databaseFolder = "\\csv";
			string[] filenames = Directory.GetFiles(Directory.GetCurrentDirectory() + databaseFolder);

			//process first file
			String[] lines = File.ReadAllText(filenames[0]).Replace(",", ".").Split('\n');
			foreach (string line in lines)
			{
				repo.AddMatch(line, 0);
			}


			Dictionary<string, bool> processedLines = new Dictionary<string, bool>();
			//process rest of the files
			for (int i = 1; i < filenames.Length; i++)
			{
				processedLines.Clear();
				lines = File.ReadAllText(filenames[i]).Replace(",", ".").Split('\n');
				foreach (string line in lines)
				{
					bool result = repo.ProcessMatch(line);
					if(!processedLines.ContainsKey(line))
					{
						processedLines.Add(line, result);
					}
				}

				int uspele = 0;
				//Console.WriteLine(string.Format("PRONASAO: {0}", processedLines.Where(o => o.Value == true).Count));
				foreach(KeyValuePair<string, bool> kvp in processedLines)
				{
					if(kvp.Value)
					{
						uspele++;
					}
					else
					{
						
					}
				}
				
				Console.WriteLine(string.Format("USPELE {0}", uspele));


				//repo.AddMatch(line, i);
			}
			

			Console.ReadKey();
		}

	}
}
